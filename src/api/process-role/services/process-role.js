'use strict';

/**
 * process-role service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::process-role.process-role');
