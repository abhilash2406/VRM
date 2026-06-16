import users from '../../models/users.js';
import login from '../../models/login.js';
import designations from '../../models/designation.js';
import permissions from '../../models/permission.js';
import contacts from '../../models/contact.js';
import jwt from 'jsonwebtoken';
import permissionSetting from '../../models/permissionSetting.js';
import CryptoJS from 'crypto-js';

export const viewProfileService = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const who = await login.findByPk(decoded.id);
  return await users.findOne({ where: { loginId: who.id } });
};

export const getUserMessagesService = async () => {
  return await contacts.findAll({});
};

export const getMsgToReadService = async (id) => {
  const feedback = await contacts.findByPk(id);
  await contacts.update({ status: 'read' }, { where: { id } });
  return feedback;
};

export const dltFeedbackService = async (id) => {
  const feedback = await contacts.findByPk(id);
  if (!feedback) {
    throw new Error('Feedback not found');
  }
  await feedback.destroy();
  return true;
};

export const profilePermissionsService = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await login.findByPk(decoded.id);
  const permission_data = await permissionSetting.findAll({
    where: { designationId: user.designationId },
    include: permissions,
  });

  const mappingArray = permission_data.map((data) => ({
    menu: data.permission.menu,
    subMenu: data.permission.subMenu,
  }));

  const role = await designations.findByPk(user.designationId);

  return { permission: mappingArray, designation: role.designation };
};

export const changePasswordService = async (data, token) => {
  const decrypted = CryptoJS.AES.decrypt(data.currentPassword, 'XkhZG4fW2t2W');
  const decrypted2 = CryptoJS.AES.decrypt(data.newPassword, 'XkhZG4fW2t2W');
  const decrypted3 = CryptoJS.AES.decrypt(data.confirmPassword, 'XkhZG4fW2t2W');
  
  const currentPassword = decrypted.toString(CryptoJS.enc.Utf8);
  const newPassword = decrypted2.toString(CryptoJS.enc.Utf8);
  const confirmPassword = decrypted3.toString(CryptoJS.enc.Utf8);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const who = await login.findByPk(decoded.id);

  if (!who) {
    throw new Error('You dont have the permission to change the password');
  }

  const verifyPassword = await login.verifyPassword(currentPassword, who.password, who.salt);
  if (!verifyPassword) {
    throw new Error('You entered the Wrong Password');
  }

  const salt = await login.generateSalt();
  const password = await login.hashPassword(newPassword, salt);
  await login.update({ salt, password }, { where: { id: who.id } });
  
  return true;
};
