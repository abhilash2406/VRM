import * as services from './service.js';

export const viewProfile = async (req, res, next) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    const data = await services.viewProfileService(token);
    res.send({ success: true, message: 'data fetched successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getUserMessages = async (req, res, next) => {
  try {
    const data = await services.getUserMessagesService();
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getMsgToRead = async (req, res, next) => {
  try {
    const data = await services.getMsgToReadService(req.params.id);
    res.send({ success: true, message: 'marked as read', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const dltFeedback = async (req, res) => {
  try {
    await services.dltFeedbackService(req.params.id);
    res.send({ success: true, message: ' deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const ProfilePermissions = async (req, res, next) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    const data = await services.profilePermissionsService(token);
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    await services.changePasswordService(req.body, token);
    res.send({ success: true, message: 'password changed successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
