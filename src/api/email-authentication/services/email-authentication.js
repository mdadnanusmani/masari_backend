'use strict';

/**
 * email-authentication service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-authentication.email-authentication');
