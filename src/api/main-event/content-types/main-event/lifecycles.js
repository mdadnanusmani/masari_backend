module.exports = {
    async afterCreate(event) {
        try {
            const { result, params } = event;

            let notification = null;
            if (!(params.data.locale === 'en')) {
                notification = await strapi.entityService.create('api::notification.notification', {
                    data: {
                        type: 'event',
                        body: `${result.id}`,
                        metadata: {
                            date: result?.date,
                            title_ar: result?.title,
                            title_en: "",
                            url: `/events/all/${result.id}`
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
                        type: 'event',
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
};  