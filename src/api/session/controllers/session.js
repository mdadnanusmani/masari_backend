'use strict';

/**
 * session controller
 */
const axios = require('axios');
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::session.session', ({ strapi }) =>  ({
  async update(ctx) {
    try {
      const apiResponse = await axios.post('https://extra.sportsboulevard.sa/api/WMConnect?engineName=sbfuatcap&userName=supervisor&UserExist=N',null, {
        headers: {
          'Content-Type': 'application/xml',
          'password':'Admin@2021'
        }
      });

	    console.log(apiResponse.data.WMConnect_Output.Participant.SessionId, ' apiResponse');

const sessionData = {
	  token: `${apiResponse.data.WMConnect_Output.Participant.SessionId}`
};

const entity = await strapi.entityService.update('api::session.session',1, {data:sessionData});

	    console.log(entity, ' entity');

      return entity;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
}));
