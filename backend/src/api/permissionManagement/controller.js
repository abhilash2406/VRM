import { getAllPermissionsService, grantPermissionsService, getUserDataService } from './service.js';

export const getAllPermissions = async (req, res, next) => {
  try {
    const data = await getAllPermissionsService();
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message || e });
  }
};

export const grantPermissions = async (req, res, next) => {
  try {
    const { socket } = req.app.locals;
    await grantPermissionsService(req.params.id, req.body, socket);
    res.send({ success: true, message: 'Updated successfully' });
  } catch (e) {
    res.json({ success: false, message: e.message || e });
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const data = await getUserDataService(req.params.id);
    res.send({ success: true, message: 'successfully fetched data', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
