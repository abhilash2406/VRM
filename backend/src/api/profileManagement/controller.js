import {
  viewProfileService,
  getUserMessagesService,
  getMsgToReadService,
  dltFeedbackService,
  profilePermissionsService,
  changePasswordService,
} from './service.js';

/**
 * Retrieves the currently authenticated user's profile.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const viewProfile = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    const data = await viewProfileService(token);
    res.send({ success: true, message: 'data fetched successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Fetches all contact messages sent by users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getUserMessages = async (req, res, next) => {
  try {
    const data = await getUserMessagesService();
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Marks a specific contact message as read.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getMsgToRead = async (req, res, next) => {
  try {
    const data = await getMsgToReadService(req.params.id);
    res.send({ success: true, message: 'marked as read', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a specific contact feedback message.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const dltFeedback = async (req, res) => {
  try {
    await dltFeedbackService(req.params.id);
    res.send({ success: true, message: ' deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

/**
 * Retrieves the permissions and designation assigned to the currently authenticated user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const ProfilePermissions = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    const data = await profilePermissionsService(token);
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Changes the authenticated user's password.
 * @param {import('express').Request} req - The Express request object containing the encrypted passwords.
 * @param {import('express').Response} res - The Express response object.
 */
export const changePassword = async (req, res) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    await changePasswordService(req.body, token);
    res.send({ success: true, message: 'password changed successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
