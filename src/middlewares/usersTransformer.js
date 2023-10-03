'use strict';

/**
 * `usersTransformer` middleware
 */

// Function to transform a user object
function transformUser(user) {
  // strapi.log.debug('usersTransformer', user)
  // Modify the user object as desired
  // strapi.log.debug(process.env.BASE_URL)
  user.avatar = (process.env.BASE_URL + 'api/avatar/' + user.id);

  return user;
}

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    // strapi.log.debug(JSON.stringify({ url: ctx.request.url, isUsers: JSON.stringify(ctx.request.url.startsWith('/api/users')) }))

    // Check if the request is for the /users endpoint
    if (ctx.request.url.startsWith('/api/users')) {
      // Get the original response from the controller
      await next();

      // Check if the response is an array of users
      if (Array.isArray(ctx.response.body)) {
        // Transform each user object
        ctx.response.body = ctx.response.body.map(transformUser);
      } else {
        // Transform a single user object
        // strapi.log.debug('usersTransformer', transformUser(ctx.response.body))
        ctx.response.body = transformUser(ctx.response.body);
      }
    } else {
      // Continue to the next middleware
      await next();
    }

  };


};

