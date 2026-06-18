import users from '../../models/users.js';
import { UserType } from '../../common/enum/user-type-enum.js';
import designations from '../../models/designation.js';
import permissions from '../../models/permission.js';
import contacts from '../../models/contact.js';
import jwt from 'jsonwebtoken';
import permissionSetting from '../../models/permissionSetting.js';
import CryptoJS from 'crypto-js';

/**
 * Validates a JWT token and fetches the user's profile based on the decoded ID.
 * @param {string} token - The raw JWT token string.
 * @returns {Promise<Object>} The user database record.
 * @throws {Error} If the token is invalid or user is not found.
 */
export const viewProfileService = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await users.findByPk(decoded.id);
};

/**
 * Retrieves all user contact feedback/messages.
 * @returns {Promise<Array>} List of contact records.
 */
export const getUserMessagesService = async () => {
  return await contacts.findAll({});
};

/**
 * Retrieves a specific contact message by ID and marks it as 'read'.
 * @param {string} id - The UUID of the contact message.
 * @returns {Promise<Object>} The requested contact record.
 */
export const getMsgToReadService = async (id) => {
  const feedback = await contacts.findByPk(id);
  await contacts.update({ status: 'read' }, { where: { id } });
  return feedback;
};

/**
 * Deletes a specific contact feedback message.
 * @param {string} id - The UUID of the contact message to delete.
 * @returns {Promise<boolean>} True if deleted successfully.
 * @throws {Error} If the feedback message does not exist.
 */
export const dltFeedbackService = async (id) => {
  const feedback = await contacts.findByPk(id);
  if (!feedback) {
    throw new Error('Feedback not found');
  }
  await feedback.destroy();
  return true;
};

/**
 * Decodes a JWT token and fetches the permissions and designation associated with the user's role.
 * @param {string} token - The raw JWT token string.
 * @returns {Promise<Object>} An object containing the user's permissions array and designation type.
 */
export const profilePermissionsService = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await users.findByPk(decoded.id);
  const permission_data = await permissionSetting.findAll({
    where: { designation_id: user.designation_id },
    include: permissions,
  });

  const mappingArray = permission_data.map((data) => ({
    menu: data.permission.menu,
    sub_menu: data.permission.sub_menu,
  }));

  const role = await designations.findByPk(user.designation_id);

  return { permission: mappingArray, designation: role ? role.designation : UserType.USER };
};

/**
 * Changes a user's password using AES-decrypted payload data.
 * @param {Object} data - Contains AES-encrypted currentPassword, newPassword, and confirmPassword.
 * @param {string} token - The JWT token used to identify the user.
 * @returns {Promise<boolean>} True if the password is changed successfully.
 * @throws {Error} If the user doesn't exist or the current password doesn't match.
 */
export const changePasswordService = async (data, token) => {
  const decrypted = CryptoJS.AES.decrypt(data.currentPassword, 'XkhZG4fW2t2W');
  const decrypted2 = CryptoJS.AES.decrypt(data.newPassword, 'XkhZG4fW2t2W');
  const decrypted3 = CryptoJS.AES.decrypt(data.confirmPassword, 'XkhZG4fW2t2W');

  const currentPassword = decrypted.toString(CryptoJS.enc.Utf8);
  const newPassword = decrypted2.toString(CryptoJS.enc.Utf8);
  const confirmPassword = decrypted3.toString(CryptoJS.enc.Utf8);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const who = await users.findByPk(decoded.id);

  if (!who) {
    throw new Error('You dont have the permission to change the password');
  }

  const verifyPassword = await who.verifyPassword(currentPassword);
  if (!verifyPassword) {
    throw new Error('You entered the Wrong Password');
  }

  // Hook handles hashing
  await who.update({ password_hash: newPassword });

  return true;
};
