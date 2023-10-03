'use strict';
const { parseMultipartData } = require('@strapi/utils');

/**
 * email-authentication controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const parseBody = (ctx) => {
    if (ctx.is('multipart')) {
        return parseMultipartData(ctx);
    }

    const { data } = ctx.request.body || {};

    return { data };
};

module.exports = createCoreController('api::email-authentication.email-authentication', ({ strapi }) => ({
    async update(ctx) {
        const { query } = ctx.request;
        const { data, files } = parseBody(ctx);
        // some more logic
        if (!isObject(data)) {
            throw new ValidationError('Missing "data" payload in the request body');
        }

        const entity = await strapi
            .service(uid)
            .createOrUpdate({ ...query, data: data, files });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    }
}));
