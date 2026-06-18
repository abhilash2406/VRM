import users from '../../models/users.js';
import { UserType } from '../../common/enum/user-type-enum.js';
import designations from '../../models/designation.js';
import permissions from '../../models/permission.js';
import contacts from '../../models/contact.js';
import jwt from 'jsonwebtoken';
import permissionSetting from '../../models/permissionSetting.js';

/**
 * Validates a user ID and fetches the user's profile.
 * @param {string|number} userId - The ID of the user.
 * @returns {Promise<Object>} The user database record.
 * @throws {Error} If the token is invalid or user is not found.
 */
export const viewProfileService = async (userId) => {
  return await users.findByPk(userId);
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
 * Fetches the permissions and designation associated with the user's role based on their ID.
 * @param {string|number} userId - The ID of the user.
 * @returns {Promise<Object>} An object containing the user's permissions array and designation type.
 */
export const profilePermissionsService = async (userId) => {
  const user = await users.findByPk(userId);
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
 * Changes a user's password.
 * Expects plain-text oldPassword, newPassword, and confirmPassword (validated upstream by Joi).
 * @param {Object} data - Contains oldPassword, newPassword, and confirmPassword.
 * @param {string} data.oldPassword - The user's current password.
 * @param {string} data.newPassword - The desired new password.
 * @param {string} data.confirmPassword - Must match newPassword.
 * @param {string|number} userId - The ID of the authenticated user.
 * @returns {Promise<boolean>} True if the password is changed successfully.
 * @throws {Error} If the user doesn't exist, the old password is wrong, or passwords don't match.
 */
export const changePasswordService = async (data, userId) => {
  const { oldPassword, newPassword, confirmPassword } = data;

  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirm password do not match');
  }

  const who = await users.findByPk(userId);

  if (!who) {
    throw new Error('You do not have permission to change the password');
  }

  const verifyPassword = await who.verifyPassword(oldPassword);
  if (!verifyPassword) {
    throw new Error('The old password you entered is incorrect');
  }

  // beforeUpdate hook in users model handles hashing automatically
  await who.update({ password_hash: newPassword });

  return true;
};
