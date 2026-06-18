import contact from '../../models/contact.js';
import sendEmails from '../../utils/sendEmail.js';
import { logger } from '../../config/winston-config.js';

/**
 * Processes a contact form submission, saves it to the database, and sends email notifications.
 * @param {Object} data - The contact form payload.
 * @param {string} data.name - The sender's name.
 * @param {string} data.email - The sender's email.
 * @param {string} data.phone_number - The sender's phone number.
 * @param {string} data.message - The content of the contact message.
 * @returns {Promise<Object>} The created contact record.
 * @throws {Error} If emails fail to send or database insert fails.
 */
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
    text: `Hi a new contact form has been submitted by ${data.name} with message ${data.message} and phone number ${data.phone_number} `,
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
