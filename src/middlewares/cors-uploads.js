'use strict';

/**
 * `cors-uploads` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    await next();

    ctx.set("Access-Control-Allow-Origin", "*")
  };
};
