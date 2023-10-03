"use strict";

const crypto = require("crypto");
const _ = require("lodash");
const utils = require("@strapi/utils");
// const sanitize = require('./sanitize');
const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

module.exports = (plugin) => {
  plugin.services.providers.buildRedirectUri = (provider = "") =>
    `${getAbsoluteServerUrl(strapi.config)}/connect/${provider}/callback`;

  plugin.controllers.auth.connect = async (ctx, next) => {
    const grant = require("grant-koa");
    const providers = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "grant" })
      .get();

    const apiPrefix = strapi.config.get("api.rest.prefix");
    const grantConfig = {
      defaults: {
        prefix: `${apiPrefix}/connect`,
      },
      ...providers,
    };

    const [requestPath] = ctx.request.url.split("?");
    const provider = requestPath.split("/connect/")[1].split("/")[0];

    if (!_.get(grantConfig[provider], "enabled")) {
      throw new ApplicationError("This provider is disabled");
    }

    if (!strapi.config.server.url.startsWith("http")) {
      strapi.log.warn(
        "You are using a third party provider for login. Make sure to set an absolute url in config/server.js. More info here: https://docs.strapi.io/developer-docs/latest/plugins/users-permissions.html#setting-up-the-server-url"
      );
    }

    // Ability to pass OAuth callback dynamically
    grantConfig[provider].callback =
      _.get(ctx, "query.callback") ||
      _.get(ctx, "session.grant.dynamic.callback") ||
      grantConfig[provider].callback;
    grantConfig[provider].redirect_uri = strapi
      .plugin("users-permissions")
      .service("providers")
      .buildRedirectUri(provider);
    grantConfig[
      provider
    ].authorize_url = `https://login.microsoftonline.com/${process.env.MICROSOFT_AUTH_TENANT_ID}/oauth2/v2.0/authorize`;
    grantConfig[
      provider
    ].access_url = `https://login.microsoftonline.com/${process.env.MICROSOFT_AUTH_TENANT_ID}/oauth2/v2.0/token`;
    return grant(grantConfig)(ctx, next);

  };


  plugin.services["providers"] = require("./server/services/providers");

  const sanitizeOutput = (user) => {
    const {
      password, resetPasswordToken, confirmationToken, ...sanitizedUser
    } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      `plugin::users-permissions.user`,
      ctx.state.user.id,
      { populate: ['role', 'department', 'cv', 'cv.media'] }
    );
    ctx.body = sanitizeOutput(user);
  }



  return plugin;
};
