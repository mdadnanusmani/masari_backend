module.exports = {
    async afterCreate(event) {
        try {
            const { result, params } = event;
            // create a notification for the mentioned user 
            // for images mention_album:27:images_49_47
            // for videos   mention_video_3_47

            if (params?.data.src_user === params?.data.tgt_user) {
                strapi.log.error('users equal')
                strapi.log.error(`${params?.data.srcUser} === ${params?.data.tgtUser}}`)
                return;
            }
            const identifier = result?.body;
            const mediaType = identifier.indexOf('album') >= 0 ? 'photo-gallery' : 'video-gallery';
            const [_mention, target, target_id, ـuser_id] = identifier.split('_');
            const [ـtarget_type, target_parent_id] = target.split(':');
            const srcUser = await strapi.entityService.findOne('plugin::users-permissions.user', params.data.src_user);

            const notification = await strapi.entityService.create('api::notification.notification', {
                data: {
                    type: 'mention',
                    user: params.data.tgt_user,
                    metadata: {
                        url: `/${mediaType}${target_parent_id ? `/${target_parent_id}` : ''}/${target_id}`,
                        srcUser: srcUser.displayName || srcUser.givenName,
                        targetUser: params.data.tgt_user,
                        target_type: mediaType
                    }
                }
            });

            strapi.entityService.create('api::mail-queue.mail-queue', {
                data: {
                    identifier: `mention-${result.id}`,
                    type: 'notification',
                    meta: {
                        type: 'notification',
                        id: notification.id,
                        locale: result.locale,
                        url: `/${mediaType}${target_parent_id ? `/${target_parent_id}` : ''}/${target_id}`,


                    }
                }
            })




            const notifications = await strapi.entityService.findMany('api::notification.notification',
                { _limit: 10, _sort: 'createdAt:desc', filters: { $and: [{ read: false }, { $or: [{ user: params.data.tgt_user }, { user: null }] }] } });

            strapi.io.emit(`notification_${params.data.tgt_user}`, JSON.stringify(notifications));
        } catch (e) {
            strapi.log.error(e)
        }
    },
};  