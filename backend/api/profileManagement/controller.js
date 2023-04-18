const users = require('../../models/users');
const login = require('../../models/login');
const designation = require('../../models/designation');
const contacts = require('../../models/contact');
const jwt = require('jsonwebtoken');

exports.viewProfile = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    //   console.log('token', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let who = await login.findByPk(decoded.id);
    // console.log(who);
    let currentUser = await users.findOne({
      where: {
        loginId: who.id,
      },
    });
    console.log('currentUser', currentUser);
    res.send({
      success: true,
      message: 'data fetched successfully',
      data: currentUser,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.getUserMessages = async (req, res, next) => {
  try {
    const data = await contacts.findAll({});
    // console.log('vdata', data);
    res.send({
      success: true,
      message: 'successfully fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.approveMsg = async (req, res, next) => {
  try {
    console.log('req.body', req.body.id);
    const feedback = await contacts.findByPk(req.body.id);
    console.log('feedback', feedback);
    await contacts.update({ status: 'read' }, { where: { id: req.body.id } });
    res.send({
      success: true,
      message: 'marked as read',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
