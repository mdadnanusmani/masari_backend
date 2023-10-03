'use strict';

/**
 * A set of functions called "actions" for `send-mail`
 */

const notification_email =



  module.exports = {
    exampleAction: async (ctx, next) => {
      const baseUrl = process.env.BASE_URL;

      try {
        await strapi.plugin('email').service('email').send({
          to: 'someone@example.com',
          from: 'someone2@example.com',
          subject: 'Hello world',
          text: 'Hello world',
          html: `
        <!DOCTYPE html>
<html>
    <head>
    <style>
        @font-face {
          font-family: "GE Flow";
          src: url("${baseUrl}fonts/GEFlow-Bold.eot");
          src: url("${baseUrl}fonts/GEFlow-Bold.eot?#iefix") format("embedded-opentype"),
            url("${baseUrl}fonts/GEFlow-Bold.woff2") format("woff2"),
            url("${baseUrl}fonts/GEFlow-Bold.woff") format("woff"),
            url("${baseUrl}fonts/GEFlow-Bold.ttf") format("truetype");
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "GE Flow";
          src: url("${baseUrl}fonts/GEFlow.eot");
          src: url("${baseUrl}fonts/GEFlow.eot?#iefix") format("embedded-opentype"),
            url("${baseUrl}fonts/GEFlow.woff2") format("woff2"), url("${baseUrl}/fonts/GEFlow.woff") format("woff"),
            url("${baseUrl}fonts/GEFlow.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        main {
          background-color: #f5f8fa;
          min-height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap:3rem;
          font-family: "GE Flow" , tahoma;
          text-align: center;
          padding-top:10%;
          padding-bottom:10%;

        }
        .hero {
          background-color: #ffffff;
          /* small shadow to make the panel pop */
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05),
            0 1px 3px 0 rgba(0, 0, 0, 0.1);
          min-height: 50%;
          width: 50%;
          padding: 75px;
        }
        .cover {
          min-height: 50%;
        }
        
        .content {
          min-height:50%;
        }

        .content a {
          text-decoration:underline;
          color:#00C2F3;
        }

        .content a:hover {
          opacity:0.8;
        }

        .seperator {
          height: 4px;
          border-radius: 4px;
          background-color: #000000;
        }

        .content h1{
          font-size: 4rem;
          font-weight: 500;
        }
        .footer{
          display:flex;
          width:50%;
          flex-direction:column;
        }

        .logo{
          width:30%;
          
        }
        .logo img{
          width:100%;
          object-fit:cover;
        }
      </style>
    </head>

    <body>
      <main>
      <div class="logo">
      <img  src="cid:logo"/></div>
      <div class="hero">
        <div class="cover">
          <img src="cid:notifications"/>
        </div>
        <div class="content">
          <div class="seperator"></div>
          <h1>تنبيهات</h1>
          <p></p>
          <a href="https://www.google.com">اضغط هنا</a>
        </div>
      </div>
      <div class="footer">
      <div>
      إذا كان لديك أي استفسارات ، فيرجى الاتصال بنا على </div> 
      <div>support@mail.com</div>
      <div>
      .او لإلغاء الاشتراك من قوائمنا البريدية
      </div>

      </div>
      </main>
    </body>

    </html> `,
          attachments: [{
            filename: 'logo.png',
            path: process.cwd() + '/public/logo.png',
            cid: 'logo' //same cid value as in the html img src
          }, {
            filename: 'notification.png',
            path: process.cwd() + '/public/notification.png',
            cid: 'notifications' //same cid value as in the html img src
          }]
        });
        ctx.body = 'ok' + baseUrl;
      } catch (err) {
        ctx.body = err;
      }
    }
  };
