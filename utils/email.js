/* eslint-disable */

import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const smtpTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Support <${process.env.MAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  return await smtpTransporter.sendMail(mailOptions);
};

export default sendEmail;
