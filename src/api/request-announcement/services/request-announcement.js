'use strict';

/**
 * request-announcement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::request-announcement.request-announcement');
