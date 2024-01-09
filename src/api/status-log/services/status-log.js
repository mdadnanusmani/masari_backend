'use strict';

/**
 * status-log service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::status-log.status-log');
