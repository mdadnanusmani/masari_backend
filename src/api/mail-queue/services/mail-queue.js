'use strict';

/**
 * mail-queue service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mail-queue.mail-queue');
