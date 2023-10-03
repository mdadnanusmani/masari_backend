'use strict';

/**
 * main-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::main-event.main-event');
