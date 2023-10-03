module.exports = {
    async afterCreate(event) {

        try {
            const { result, params } = event;
            // strapi.log.debug(JSON.stringify({ result }))
            let notification = null;
            if (params.data.status === "published" && params.data.is_mailable) {
                strapi.entityService.create('api::mail-queue.mail-queue', {
                    data: {
                        identifier: `news-letter-${result.id}`,
                        type: 'publication',
                        meta: {
                            type: 'news-letter',
                            id: result.id,
                            locale: result.locale,
                            localization: params.data.localizations[0],
                        }
                    }
                })
            }

            if (!(params.data.locale === 'en')) {
                notification = await strapi.entityService.create('api::notification.notification', {
                    data: {
                        type: 'news-letter',
                        body: `${result.id}`,
                        metadata: {
                            date: result?.createdAt,
                            title_ar: result?.title,
                            title_en: "",
                            url: `news/${result.id}`
                        }
                    }
                });
            }

            if (result.locale === 'en') {
                const ar_notification = (await strapi.entityService.findMany('api::notification.notification', {
                    filters: { body: { $eq: `${params.data.localizations[0]}` } },
                    sort: { createdAt: 'DESC' },
                    limit: 1
                }))[0]

                if (!ar_notification) return;

                notification = await strapi.entityService.update('api::notification.notification', ar_notification.id, {
                    data: {
                        id: ar_notification.id,
                        type: 'image',
                        metadata: {
                            ...ar_notification.metadata,
                            title_en: params?.data?.title,
                        }
                    }
                });
            }


            if (notification)
                strapi.io.emit(`notification_all`, JSON.stringify([notification]));
        } catch (e) {
            strapi.log.error(e)
        }
    },
    afterUpdate(event) {

        const { result } = event;
        // strapi.log.debug(JSON.stringify({ result }))

        if (result.status === "published" && result.is_mailable && result.locale === "en") {
            strapi.entityService.create('api::mail-queue.mail-queue', {
                data: {
                    identifier: `news-letter-${result.id}`,
                    type: 'publication',
                    meta: {
                        type: 'news-letter',
                        id: result.id,
                        locale: result.locale,
                    }
                }
            })
        }
    },
};  