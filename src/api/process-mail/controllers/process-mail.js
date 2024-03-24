'use strict';
const nodemailer = require('nodemailer');
/**
 * A set of functions called "actions" for `process-mail`
 */

module.exports = {
sendEmail: async (ctx, next) => {
 const { to, subject, text, html } = JSON.parse(ctx.request.body.data);
	const baseUrl = process.env.BASE_URL;
     try {
	     const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: mail_username,
    pass: mail_password,
  },
});
	     transporter.sendMail({
  from: 'info@sbf.gov.sa',
  to:to,
		     subject:subject,
  text:text,
		     html:html
}, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});

	     ctx.send({ message: 'Email sent successfully' });
     } catch (error) {
	     ctx.throw(500, error);
     }
   }
};
