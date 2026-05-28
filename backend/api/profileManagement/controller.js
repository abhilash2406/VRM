import users from '../../models/users.js';
import login from '../../models/login.js';
import designations from '../../models/designation.js';
import permissions from '../../models/permission.js';
import contacts from '../../models/contact.js';
import jwt from 'jsonwebtoken';
import permissionSetting from '../../models/permissionSetting.js';
import CryptoJS from 'crypto-js';

export const viewProfile = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    console.log('token', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let who = await login.findByPk(decoded.id);
    console.log(who);
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

export const getUserMessages = async (req, res, next) => {
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

export const getMsgToRead = async (req, res, next) => {
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

//dlt feedback
export const dltFeedback = async (req, res) => {
  const id = req.params.id;
  try {
    const feedback = await contacts.findByPk(id);
    await feedback.destroy();
    return res.send({
      success: true,
      message: ' deleted successfully',
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
};

//permissions
export const ProfilePermissions = async (req, res, next) => {
  try {
    console.log('hy');
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await login.findByPk(decoded.id);
    const permission_data = await permissionSetting.findAll({
      where: { designationId: user.designationId },
      include: permissions,
    });

    const mappingArray = permission_data.map((data) => {
      return {
        menu: data.permission.menu,
        subMenu: data.permission.subMenu,
      };
    });

    let role = await designations.findByPk(user.designationId);

    res.send({
      success: true,
      data: { permission: mappingArray, designation: role.designation },
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//change password

export const changePassword = async (req, res) => {
  const decrypted = CryptoJS.AES.decrypt(
    req.body.currentPassword,
    'XkhZG4fW2t2W'
  );
  const decrypted2 = CryptoJS.AES.decrypt(req.body.newPassword, 'XkhZG4fW2t2W');
  const decrypted3 = CryptoJS.AES.decrypt(
    req.body.confirmPassword,
    'XkhZG4fW2t2W'
  );
  const currentPassword = decrypted.toString(CryptoJS.enc.Utf8);

  const newPassword = decrypted2.toString(CryptoJS.enc.Utf8);
  const confirmPassword = decrypted3.toString(CryptoJS.enc.Utf8);

  console.log('first', currentPassword, newPassword, confirmPassword);
  const token = req.header('Authorization')
    ? req.header('Authorization').replace('Bearer ', '')
    : null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let who = await login.findByPk(decoded.id);

  if (!who) {
    errorMessage(res, 'You dont have the permission to change the password');
  }
  const VerifyPassword = await login.verifyPassword(
    currentPassword,
    who.password,
    who.salt
  );
  console.log(VerifyPassword);
  if (!VerifyPassword) {
    return errorMessage(res, 'You entered the Wrong Password');
  } else {
    const salt = await login.generateSalt();
    const Password = await login.hashPassword(newPassword, salt);
    await login.update(
      { salt: salt, password: Password },
      { where: { id: who.id } }
    );
    res.send({
      success: true,
      message: 'password changed successfully',
    });
  }
};
