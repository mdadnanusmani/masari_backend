'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('custom-password')
      .service('myService')
      .getWelcomeMessage();
  },
});
