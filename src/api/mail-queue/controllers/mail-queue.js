'use strict';

/**
 * mail-queue controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mail-queue.mail-queue');
