import { createTransport } from 'nodemailer';

let transporter = createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 587,
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASS,
  },
});

export default transporter;
