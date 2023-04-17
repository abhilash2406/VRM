const { createTransport } = require('nodemailer');

let transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
