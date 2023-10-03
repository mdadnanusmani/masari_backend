'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: 'custom-password',
    plugin: 'custom-password',
    type: 'string',
  });
};
