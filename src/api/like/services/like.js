'use strict';

/**
 * like service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const utils = require('@strapi/utils');
const { NotFoundError } = utils.errors;

module.exports = createCoreService('api::like.like', ({ strapi }) => ({
    async toggleLike({ userId, contentType, contentTypeIdentifier }) {
        const identifierString = `${contentType}_${contentTypeIdentifier}_${userId}`.toLocaleLowerCase();
        const exists = await strapi.db.query('api::like.like').findOne({
            where: {
                identifier: {
                    $eq: identifierString
                }
            }
        })

        if (!(contentType.indexOf(':') >= 0)) {
            const targetEntityId = `api::${contentType}.${contentType}`;
            const target = await strapi.entityService.findOne(targetEntityId, contentTypeIdentifier)

            if (!target)
                throw new NotFoundError('target entity not found');

            if (!exists) {
                const like = await strapi.entityService.create('api::like.like', {
                    data: { user: userId, identifier: identifierString }
                });
                const updatedEntity = await strapi.entityService.update(targetEntityId, contentTypeIdentifier, {
                    data: {
                        likes: [like.id]
                    },
                    populate: ['likes']
                })
                return { like, updatedEntity };
            }

        } else {
            const [parentContentType, parentContentIdentifier, componentKey] = contentType.split(':');

            const targetEntityId = `api::${parentContentType}.${parentContentType}`;
            const target = await strapi.entityService.findOne(targetEntityId, parentContentIdentifier, { populate: [componentKey, `${componentKey}.likes`] });

            if (!target)
                throw new NotFoundError('target entity was not found');

            if (!exists) {
                const like = await strapi.entityService.create('api::like.like', {
                    data: { user: userId, identifier: identifierString }
                });

                const componentObject = target[componentKey].find((component) => (`${component.id}` === `${contentTypeIdentifier}`))

                if (!componentObject)
                    throw new NotFoundError('target component was not found');

                const otherComponents = target[componentKey].filter(({ id }) => `${id}` !== `${contentTypeIdentifier}`).map(({ id }) => ({ id }))

                const updatedEntity = await strapi.entityService.update(targetEntityId, parentContentIdentifier, {
                    data: {
                        images: [...otherComponents, { ...componentObject, likes: [like.id] }]
                    },
                    populate: [`${componentKey}.likes`]
                })
                return { like, updatedEntity };
            }

        }


        return await strapi.entityService.delete('api::like.like', exists.id)
    }
}));
