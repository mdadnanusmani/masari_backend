const triggerSync = async () => {
    try {
        const notification = await strapi.entityService.create('api::notification.notification', {
            data: {
                type: 'sync',
                metadata: {
                    storageName: 'departments'
                }
            }
        });
        if (notification)
            strapi.io.emit(`notification_sync`, JSON.stringify([notification]));
    } catch (e) {
        strapi.log.error(e)
    }
}

module.exports = {
    async afterCreate() {
        await triggerSync()
    },
    async afterUpdate() {
        await triggerSync()
    }
};  