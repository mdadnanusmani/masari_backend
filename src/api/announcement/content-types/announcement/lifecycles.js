module.exports = {
    async afterCreate(event) {
        try {
            const { result, params } = event;
            let notification = null;

            if (params.data.publishedAt && params.data.is_mailable) {
                strapi.entityService.create('api::mail-queue.mail-queue', {
                    data: {
                        identifier: `announcement-${result.id}`,
                        type: 'publication',
                        meta: {
                            type: 'announcement',
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
                        type: 'announcement',
                        body: `${result.id}`,
                        metadata: {
                            date: result?.createdAt,
                            title_ar: result?.title,
                            title_en: "",
                            url: `announcements-gallery/${result.id}`
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
    async afterUpdate(event) {
        const { result, params } = event;
        // strapi.log.debug(JSON.stringify({ result, params, mailable: params.data.is_mailable, resultmail: result.is_mailable }))

        if (params.data.publishedAt && result.is_mailable && result.locale === "en") {
            strapi.entityService.create('api::mail-queue.mail-queue', {
                data: {
                    identifier: `announcement-${result.id}`,
                    type: 'publication',
                    meta: {
                        type: 'announcement',
                        id: result.id,
                        locale: result.locale,
                        localization: result.locale,
                    }
                }
            })
        }

    }
};  