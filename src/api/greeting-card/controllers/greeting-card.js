'use strict';

/**
 * greeting-card controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::greeting-card.greeting-card');
