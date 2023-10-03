'use strict';

/**
 * mail-queue router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mail-queue.mail-queue');
