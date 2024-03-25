module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/process-mail',
      handler: 'process-mail.sendEmail',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
