'use strict';

/**
 * audit-request service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::audit-request.audit-request');
