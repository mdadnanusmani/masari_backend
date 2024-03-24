module.exports = [
  'strapi::errors',

  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", 'editor.unlayer.com'],
          'frame-src': ["'self'", 'editor.unlayer.com'],
          'img-src': [
            "'self'",
            'data:',
            'cdn.jsdelivr.net',
            'strapi.io',
            's3.amazonaws.com',
          ],
        },
      },
    },
  },
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: 'SBF'
    },
  },

  //'strapi::logger',
   { name: 'strapi::logger', config: { level: 'silly' } },
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
      parser: {
        enabled: true,
        multipart: true,
        includeUnparsed: true,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::cors-uploads',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      method: ['GET'],
      // credentials: true,
      // origin: ['*']
      origin: ['https://backendmasari-riyadhalmasar.msappproxy.net','http://localhost:8000', 'http://localhost:1337', 'http://localhost:3000','http://localhost:3000/','https://stage-masari-legal.sbf.gov.sa', 'https://stage-api-masari.sbf.gov.sa', 'https://stage-masari.sbf.gov.sa', 'https://masari.sbf.gov.sa', "https://backend.mstage.pas.sa", 'https://backend.masari.sbf.gov.sa', 'https://backend-masari.sbf.gov.sa', 'https://prod-masari.sbf.gov.sa']
    }
  },
  {
    name: 'global::usersTransformer',
    "config": {
      "enabled": true
    }
  }

];
