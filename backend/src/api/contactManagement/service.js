import contact from '../../models/contact.js';
import mail from '../../modules/mail.js';
import { logger } from '../../config/winston-config.js';

export const submitContactForm = async (data) => {
  data.status = 'unread';
  const createdContact = await contact.create(data);

  const mailOptions = {
    from: process.env.USER_MAIL,
    to: data.email,
    subject: 'your review ',
    text: `Hi ${data.name} our representative will contact you shortly `,
  };

  const mailOptions2 = {
    from: process.env.USER_MAIL,
    to: 'mailto:abhilashkumar@spericorn.com',
    subject: 'New Contact Form Submission',
    text: `Hi a new contact form has been submitted by ${data.name} with message ${data.message} and phone number ${data.phoneNumber} `,
  };

  try {
    await mail.sendMail(mailOptions);
    logger.info('Email sent');
  } catch (err) {
    throw err;
  }

  try {
    await mail.sendMail(mailOptions2);
    logger.info('Email sent to admin');
  } catch (err) {
    throw err;
  }

  return createdContact;
};
