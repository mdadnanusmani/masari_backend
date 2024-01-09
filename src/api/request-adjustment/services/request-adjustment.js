'use strict';

/**
 * request-adjustment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::request-adjustment.request-adjustment');
