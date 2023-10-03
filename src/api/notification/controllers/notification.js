'use strict';
const { sanitize } = require('@strapi/utils');

/**
 * notification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::notification.notification', ({ strapi }) => {
    return ({
        async find(ctx) {
            // some custom logic here
            ctx.query.populate = ctx.query.populate ? ctx.query.populate.indexOf('users_who_reads') >= 0 ? ctx.query.populate : ctx.query.populate.push('users_who_reads') : ['users_who_reads']
            // Calling the default core action
            const { data, meta } = await super.find(ctx);
            // some more custom logic
            meta.date = Date.now()
            // get the current user
            const user = ctx.state.user;
            return {
                data: data.map(notification => ({
                    ...notification, attributes: {
                        ...notification.attributes,
                        read: notification.attributes.users_who_reads?.data?.map(item => item.id).indexOf(user.id) >= 0,
                        users_who_reads: undefined
                    }
                })), meta
            };
        },
    })
})


