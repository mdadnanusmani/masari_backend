'use strict';

/**
 * status-log router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::status-log.status-log');
