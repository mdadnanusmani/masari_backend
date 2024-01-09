'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('sbf-auth-microsoft')
      .service('myService')
      .getWelcomeMessage();
  },
});
