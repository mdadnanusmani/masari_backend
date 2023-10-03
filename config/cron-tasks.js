const { get_publication_template, get_notification_template } = require("../mail-templates");

const sendMail = async ({
    type, // publication or notification
    subject,
    mediaName,
    to,
    from,
    locale,
    url
}) => {
    const baseUrl = process.env.BASE_URL;

    const attachments = [{
        filename: 'logo.png',
        path: process.cwd() + '/public/logo.png',
        cid: 'logo' //same cid value as in the html img src
    }];

    if (type === 'publication') {
        attachments.push({
            filename: mediaName,
            path: `${process.cwd()}/public/uploads/${mediaName}`,
            cid: 'media' //same cid value as in the html img src
        })
    }

    if (type === 'notification') {
        attachments.push({
            filename: 'notification.png',
            path: process.cwd() + '/public/notification.png',
            cid: 'notifications' //same cid value as in the html img src
        })
    }

    const body = type === 'publication' ? get_publication_template(subject, locale) : get_notification_template(subject, locale, url);
    try {
        return await strapi.plugin('email').service('email').send({
            to,
            from,
            subject,
            text: body,
            html: body,
            attachments
        });
    } catch (err) {
        ctx.body = err;
        strapi.log.error(JSON.stringify({ err }));
    }

}



module.exports = {

    mailJob: {
        task: async ({ strapi }) => {
            // fetch mail queue tasks from 'api::mail-queue.mail-queue' 
            // exit if there is a task that task.is_pending = true
            // pick the first task with the least value of id and task.finished_sending=false and set task.is_pending = true
            // start sending that task to all users if it has a task.type='publication'
            // set the  task.finished_sending = true and task.is_pending = false

            const nextQueues = await strapi.entityService.findMany('api::mail-queue.mail-queue', {
                filters: {
                    // should not equal true since it can be null
                    finished_sending: {
                        $eq: false
                    }
                },
                sort: {
                    id: 'ASC'
                },
            });
            if (!(nextQueues.length > 0)) {
                // Hurray! we have no tasks 
                strapi.log.debug("There are no mail tasks");
                return;
            }

            if (nextQueues.some((queue) => queue.is_pending)) {
                // code red we have a task that is pending
                strapi.log.debug("There is a task that is pending");
                return;
            }

            const currentQueue = nextQueues[0];

            await strapi.entityService.update('api::mail-queue.mail-queue', currentQueue.id, {
                data: {
                    id: currentQueue.id,
                    is_pending: true
                }
            });

            const mediaPropName = currentQueue.meta.type === 'news-letter' ? 'image' : 'media'

            // get the object data 
            const dataObject = await strapi.entityService.findOne(
                `api::${currentQueue.meta.type}.${currentQueue.meta.type}`,
                currentQueue.meta.id,
                {
                    populate: currentQueue.meta.type !== "notification" ? [mediaPropName] : []
                });
            if (!dataObject) {
                // no object found
                strapi.log.debug("No object found");
                return;
            }

            const mediaObject = currentQueue.meta.type === 'news-letter' ? dataObject[mediaPropName] : dataObject[mediaPropName]?.[0]

            if (currentQueue.meta.type !== "notification" && !mediaObject) {
                strapi.log.debug(`no media file for ${currentQueue.identifier}`);
                return;
            }
            // get all users
            const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
                ...(currentQueue.meta.type !== "notification" ? {} : {
                    filters: {
                        id: {
                            $eq: dataObject.metadata.targetUser
                        }
                    }
                }),
                sort: {
                    id: 'ASC'
                },
            });
            if (!users.length > 0) {
                // no users found
                strapi.log.debug("No users found");
                return;
            }

            try {
                // send the mail to all users
                const finalResult = await Promise.allSettled(users.map(async (user) => {
                    const singleResponse = await sendMail({
                        type: currentQueue.type,
                        to: user.email,
                        from: process.env.EMAIL_FROM,
                        subject: currentQueue.meta.type !== "notification" ? dataObject.title : `${dataObject.metadata.srcUser} mentioned you`,
                        locale: dataObject.locale,
                        ...(currentQueue.meta.type === "notification" ? { url: `${process.env.FRONTEND_URL}${currentQueue.meta.url}` } : {}),
                        ...(currentQueue.meta.type !== "notification" ? { mediaName: `${mediaObject.hash}${mediaObject.ext}` } : {}),
                    });
                    // strapi.log.debug(JSON.stringify({ singleResponse }));
                }
                ));
                // strapi.log.debug(JSON.stringify(finalResult));
            } catch (error) {
                strapi.log.error(JSON.stringify(error));
            }


            await strapi.entityService.update('api::mail-queue.mail-queue', currentQueue.id, {
                data: {
                    id: currentQueue.id,
                    finished_sending: true,
                    is_pending: false
                }
            });

        },
        options: {
            rule: "*/5 * * * * *",
        },
    },
};