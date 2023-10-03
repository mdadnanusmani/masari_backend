'use strict';

/**
 * audit-request router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::audit-request.audit-request');
