import { logger } from '../../config/winston-config.js';
import contact from '../../models/contact.js';
import mail from '../../modules/mail.js';

export const setContact = async (req, res, next) => {
  //   logger.info('req', req.body);
  try {
    req.body.status = 'unread';
    const data = await contact.create(req.body);

    var mailOptions = {
      from: process.env.USER_MAIL,
      to: req.body.email,
      subject: 'your review ',
      text: `Hi ${req.body.name} our representative will contact you shortly `,
    };

    var mailOptions2 = {
      from: process.env.USER_MAIL,
      to: 'mailto:abhilashkumar@spericorn.com',
      subject: 'New Contact Form Submission',
      text: `Hi a new contact form has been submitted by ${req.body.name} with message ${req.body.message} and phone number ${req.body.phoneNumber} `,
    };

    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.send({
          success: false,
          message: error,
        });
      } else {
        logger.info('Email sent  ' + info.response);
      }
    });
    mail.sendMail(mailOptions2, function (error, info) {
      if (error) {
        return res.send({
          success: false,
          message: error,
        });
      } else {
        logger.info('Email sent to admin: ' + info.response);
      }
    });
    res.send({
      success: true,
      message: 'message posted successfully',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
