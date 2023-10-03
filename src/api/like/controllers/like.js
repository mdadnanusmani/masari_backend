'use strict';

/**
 * like controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::like.like', ({ strapi }) => ({
    async create(ctx) {
        const { identifier } = ctx.request.body.data;
        const [contentType, contentTypeIdentifier, userId] = identifier.split('_');
        const result = await strapi.service('api::like.like').toggleLike({ contentType, contentTypeIdentifier, userId });
        return result;
    }
}));
