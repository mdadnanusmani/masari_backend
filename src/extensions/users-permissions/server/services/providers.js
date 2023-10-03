'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const urlJoin = require('url-join');
const purest = require('purest')
const utils = require("@strapi/utils");
// const sanitize = require('./sanitize');
const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const getService = (name) => {
    return strapi.plugin('users-permissions').service(name);
};


async function microsoft({ accessToken }) {
    const microsoft = purest({ provider: 'microsoft' });

    const providerResponse = await microsoft
        .get('me?$select=mobilePhone,preferredLanguage,jobTitle,userPrincipalName,givenName,displayName,department,id')
        .auth(accessToken)
        .request()
        .then(({ body }) => {
            return ({
                microsoft_id: body.id,
                jobTitle: body.jobTitle,
                businessPhones: (body.businessPhones || []).join(','),
                displayName: body.displayName,
                givenName: body.givenName,
                userPrincipalName: body.userPrincipalName,
                username: body.userPrincipalName,
                email: body.userPrincipalName,
                mobilePhone: body.mobilePhone,
                preferredLanguage: body.preferredLanguage,
                firstname: body.givenName,
                department: body.department
            })
        });
    let avatarMeta, avatar;
    try {
        avatarMeta = await microsoft.get('me/photo/').auth(accessToken).request().then(({ body }) => {
            return body
        })
        avatar = await microsoft.get('me/photo/$value').auth(accessToken).buffer().then(({ body }) => {
            return Buffer.from(body).toString('base64');
        })

    } catch (error) {
        strapi.log.error(error)
    }
    const avatarString = avatarMeta && avatar ? `data:${avatarMeta['@odata.mediaContentType']};base64,${avatar}` : undefined;
    const departmentList = providerResponse.department ? await strapi.entityService.findMany("api::department.department", {
        fields: ['id'],
        filters: {
            code: {
                $eq: providerResponse.department
            }
        }
    }) : [];

    try {
        if (departmentList.length === 0) {
            const arabic = await strapi.entityService.create('api::department.department', {
                data: {
                    code: `${providerResponse.department}`,
                }
            })

            const res = await strapi.controller(`api::department.department`).createLocalization({
                params: { id: arabic.id },
                request: {
                    body: {
                        locale: 'en',
                        localizations: [arabic.id]
                    }

                },
                is: () => false
            })

            return { ...providerResponse, ...{ department: arabic.id }, avatar: avatarString };
        }
    } catch (e) {
        strapi.log.error(JSON.stringify(e))
    }
    return { ...providerResponse, ...{ department: departmentList[0].id }, avatar: avatarString };
}
module.exports = ({ strapi }) => {
    /**
     * Helper to get profiles
     *
     * @param {String}   provider
     */

    const getProfile = async function (provider, query) {
        const accessToken = query.access_token || query.code || query.oauth_token;

        const providers = await strapi
            .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
            .get();

        return microsoft({ accessToken });
    };

    /**
     * Connect thanks to a third-party provider.
     *
     *
     * @param {String}    provider
     * @param {String}    accessToken
     *
     * @return  {*}
     */

    const connect = async (provider, query) => {

        const accessToken = query.access_token || query.code || query.oauth_token;

        if (!accessToken) {
            throw new Error('No access_token.');
        }

        // Get the profile.
        const profile = await getProfile(provider, query);

        const email = _.toLower(profile.email);

        // We need at least the mail.
        if (!email) {
            throw new Error('Email was not available.');
        }

        const users = await strapi.query('plugin::users-permissions.user').findMany({
            where: { email },
        });

        const advancedSettings = await strapi
            .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
            .get();
        const user = _.find(users, { provider });
        if (_.isEmpty(user) && !advancedSettings.allow_register) {
            throw new Error('Register action is actually not available.');
        }
        if (!_.isEmpty(user)) {
            // filter the new props 
            const newProps = Object.entries(profile).filter(([, value]) => value);
            // check which props have been changed
            const dirtyEntries = newProps.reduce((acc, [entrykey, entryvalue]) => {
                if (entrykey === 'email') return acc;
                if (user?.[entrykey]?.toLowerCase() !== (entryvalue?.toLowerCase?.() || entryvalue)) {
                    acc[entrykey] = entryvalue;
                }
                return acc;
            }, {});
            //update the user
            const updateResponse = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: dirtyEntries
            });
            return updateResponse;

        } else {
            if (users.length > 1 && advancedSettings.unique_email) {
                throw new Error('Email is already taken.');
            }

            // Retrieve default role.
            const defaultRole = await strapi
                .query('plugin::users-permissions.role')
                .findOne({ where: { type: advancedSettings.default_role } });

            // Create the new user.
            const newUser = {
                ...profile,
                email, // overwrite with lowercased email
                provider,
                role: defaultRole.id,
                confirmed: true,
            };

            const createdUser = await strapi
                .query('plugin::users-permissions.user')
                .create({ data: newUser });

            return createdUser;
        }




    };

    const buildRedirectUri = (provider = '') => {
        const apiPrefix = strapi.config.get('api.rest.prefix');
        return urlJoin(getAbsoluteServerUrl(strapi.config), apiPrefix, 'connect', provider, 'callback');
    };

    return {
        connect,
        buildRedirectUri,
    };
};
