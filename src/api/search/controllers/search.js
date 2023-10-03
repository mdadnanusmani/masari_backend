'use strict';
const { MeiliSearch } = require('meilisearch')

/**
 * A set of functions called "actions" for `search`
 * @param {string} query - A string to search for
 * @param {string[]} types - The types of search to perform
 */

// all types will be searched only by their title , only policies and announcements will be searched by their body

const attributesHighlightMap = {
  'announcement': ['title', 'body'],
  'policy': ['title', 'body'],
  'survey': ['title', 'description'],
  'department-document': ['title'],
  'main-event': ['title'],
  'news-letter': ['title'],
  'offer': ['title']
}

async function getBody(rawrequest) {
  let semaphore = new Promise((resolve, reject) => {
    let bodycontent = '';
    rawrequest.on('data', datapart => { bodycontent += datapart; });
    rawrequest.on('end', () => {
      try {
        resolve(JSON.parse(bodycontent));
      } catch (e) {
        reject(new Error("invalid JSON"))
      }
    });
    rawrequest.on('error', () => { reject("Error") });
  }
  )
  return semaphore;
}

module.exports = {
  getSearchResults: async (ctx, next) => {
    const store = strapi.plugin('meilisearch').service('store')
    const { apiKey, host } = await store.getCredentials()

    try {
      const client = new MeiliSearch({
        apiKey, host
      })

      const { query, types } = ctx.request.body;
      if (!query) throw new Error('query is required');
      if (!types?.length) throw new Error('types is required');
      const indexes = await Promise.all(types.map(async type => {
        if (!attributesHighlightMap[type]) throw new Error(`type ${type} is not supported`)

        const index = await client.index(type);
        index.updateSearchableAttributes(attributesHighlightMap[type])
        const results = await index.search(query, {
          attributesToHighlight: attributesHighlightMap[type] || ['*']
        });

        return { type, results };
      }));
      ctx.body = indexes.reduce((acc, index) => ({ ...acc, [index.type]: index.results }), {});

    } catch (err) {
      strapi.log.error(err)
      ctx.status = 400;
      ctx.body = { err: err.message };
    }
  }
};
