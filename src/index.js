'use strict';
var util = require('util')
const Router = require('@koa/router')

console.log(process.env.NODE_ENV)
const getUpServices = (strapi) => strapi.plugins["users-permissions"].services;
const sendMessageToSocket = (socket, message) => {
  socket.emit("message", message);
};


/* socket.io middleware */
const handshake = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const upsServices = getUpServices(strapi);
    upsServices.jwt.verify(socket.handshake.query.token).then((user) => {
      sendMessageToSocket(socket, "handshake ok");
      upsServices.user
        .fetchAuthenticatedUser(user.id)
        .then(async (detail) => {
          socket.join(detail.role?.name)
          detail.roles.split(',').forEach(role => { socket.join(role) })
          socket.join(`notification_${detail.id}`)

          const notifications = await strapi.entityService.findMany('api::notification.notification',
            {
              _limit: 10, _sort: 'createdAt:desc', filters: {
                $and: [{ $or: [{ user: user.id }, { user: null }] },
                // the current user.id is not in users_who_read
                {
                  users_who_reads: {
                    $or: [
                      {
                        id: {
                          $ne: user.id
                        },
                        id: {
                          $null: true
                        }
                      }
                    ]
                  }
                }
                ]
              }
            });


          socket.emit(`notification_${user.id}`, JSON.stringify(notifications.map(notification => ({ ...notification, read: false }))));
        });
    }).catch((err) => {
      sendMessageToSocket(socket, err.message);
      socket.disconnect()
    });
  } else {
    sendMessageToSocket(socket, "No token given.");
    socket.disconnect();
  }
  next();
};

const createProvider = (emailConfig) => {
  const providerName = emailConfig.provider.toLowerCase();
  let provider;

  let modulePath;
  try {
    modulePath = require.resolve(`@strapi/provider-email-${providerName}`);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      modulePath = providerName;
    } else {
      throw error;
    }
  }

  try {
    provider = require(modulePath);
  } catch (err) {
    throw new Error(`Could not load email provider "${providerName}".`);
  }

  return provider.init(emailConfig.providerOptions, emailConfig.settings);
};

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const router = new Router()

    router.options('/uploads/(.*)', async function (ctx, next) {
      await next();
      ctx.set("Access-Control-Allow-Origin", "*")
    })
    strapi.server.use(router.routes())



  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Get the current provider configuration


    // Modify the provider configuration
    // emailProviderConfig.provider = 'nodemailer';
    // emailProviderConfig.providerOptions = {
    //   host: 'YOUR_SMTP_HOST',
    //   port: 'YOUR_SMTP_PORT',
    //   secure: false,
    //   auth: {
    //     user: 'YOUR_SMTP_USERNAME',
    //     pass: 'YOUR_SMTP_PASSWORD',
    //   },
    // };

    // // Set the new provider configuration
    // strapi.plugins.email.config.provider = emailProviderConfig;
    let isMailInitialized = false;
    process.nextTick(async () => {

      if (!isMailInitialized) {
        try {
          strapi.log.info('trying to initialize the mail client')
          const credentials = await strapi.entityService.findOne("api::email-authentication.email-authentication", 1)
          strapi.log.debug(JSON.stringify({ credentials }))
          if (credentials) {
            //587
            //smtp.office365.com
            strapi.plugin('email').provider = createProvider({
              provider: 'nodemailer',
              providerOptions: {
                host: credentials.host,
                port: credentials.port,
                auth: {
                  user: credentials.username,//'akmabdelrahman@wsmco.sa',
                  pass: credentials.password//'BADbad91',
                },
                // ... any custom nodemailer options
              },
              settings: {
                defaultFrom: credentials.from,//'akmabdelrahman@wsmco.sa',
              },
            });
            isMailInitialized = true;
            strapi.log.info("mail client is initialized please test from the admin ui settings>mail>test mail")
          } else {
            strapi.log.error("have you initialized the mail-authentication ?")
          }
        } catch (e) {
          strapi.log.error(JSON.stringify(e))
        }

      }




      const io = require("socket.io")(strapi.server.httpServer, {
        // path: "/other/path/",
        cors: { origin: "*", methods: ["GET", "POST"] },
      });

      io.use(handshake);

      if (process.env.DEBUG == "strapio" || process.env.DEBUG == "*") {
        io.on("connection", async (socket) => {
          console.debug("Connected Socket:", socket.id, socket.rooms);
          socket.on("disconnecting", (reason) => {
            console.debug("Socket Disconnect:", socket.id, socket.rooms);
          });

        });

      }
      strapi.io = io;
    });


  },
};
