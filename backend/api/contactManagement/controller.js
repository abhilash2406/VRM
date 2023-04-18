const contact = require('../../models/contact');

exports.setContact = async (req, res, next) => {
//   console.log('req', req.body);
  try {
    req.body.status = 'unread';
    const data = await contact.create(req.body);
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
