'use strict';

/**
 * survey-application service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::survey-application.survey-application');
