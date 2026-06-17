import contact from '../../models/contact.js';
import sendEmails from '../../utils/sendEmail.js';
import { logger } from '../../config/winston-config.js';

export const submitContactForm = async (data) => {
  data.status = 'unread';
  const createdContact = await contact.create(data);

  const mailOptions = {
    to: data.email,
    subject: 'your review ',
    text: `Hi ${data.name} our representative will contact you shortly `,
  };

  const mailOptions2 = {
    to: process.env.ADMIN_MAIL,
    subject: 'New Contact Form Submission',
    text: `Hi a new contact form has been submitted by ${data.name} with message ${data.message} and phone number ${data.phoneNumber} `,
  };

  try {
    await sendEmails({ mailOptions });
    logger.info('Email sent');
  } catch (err) {
    logger.error(`Failed to send contact email: ${err.message}`);
    throw err;
  }

  try {
    await sendEmails({ mailOptions: mailOptions2 });
    logger.info('Email sent to admin');
  } catch (err) {
    logger.error(`Failed to send admin notification: ${err.message}`);
    throw err;
  }

  return createdContact;
};
