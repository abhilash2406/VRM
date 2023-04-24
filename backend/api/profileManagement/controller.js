const users = require('../../models/users');
const login = require('../../models/login');
const designations = require('../../models/designation');
const permissions = require('../../models/permission');
const contacts = require('../../models/contact');
const jwt = require('jsonwebtoken');
const permissionSetting = require('../../models/permissionSetting');

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

exports.getMsgToRead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const feedback = await contacts.findByPk(id);
    // if (feedback.status === 'unread') {
    await contacts.update({ status: 'read' }, { where: { id: id } });
    res.send({
      success: true,
      message: 'marked as read',
      data: feedback,
    });
    // }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.ProfilePermissions = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    // console.log('token', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await login.findByPk(decoded.id);
    const permission_data = await permissionSetting.findAll({
      where: { designationId: user.designationId },
      include: permissions,
    });
    // console.log('permissions', permission_data);
    const mappingArray = permission_data.map((data) => {
      return {
        menu: data.permission.menu,
        subMenu: data.permission.subMenu,
      };
    });
    // console.log('mappingArray', mappingArray);
    let role = await designations.findByPk(user.designationId);

    res.send({
      success: true,
      data: { permission: mappingArray, designation: role.Designation },
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
