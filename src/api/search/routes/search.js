module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/search',
      handler: 'search.getSearchResults',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
