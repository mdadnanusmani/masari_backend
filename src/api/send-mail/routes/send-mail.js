module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/send-mail',
      handler: 'send-mail.exampleAction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
