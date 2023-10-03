'use strict';

/**
 * greeting-card service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::greeting-card.greeting-card');
