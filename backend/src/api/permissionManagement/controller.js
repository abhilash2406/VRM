import {
  getAllPermissionsService,
  grantPermissionsService,
  getUserDataService,
} from './service.js';

/**
 * Fetches all available system permissions.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getAllPermissions = async (req, res, next) => {
  try {
    const data = await getAllPermissionsService();
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message || e });
  }
};

/**
 * Grants specific permissions to a given designation/role.
 * Also emits a socket event to update connected clients in real-time.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const grantPermissions = async (req, res, next) => {
  try {
    const { socket } = req.app.locals;
    await grantPermissionsService(req.params.id, req.body, socket);
    res.send({ success: true, message: 'Updated successfully' });
  } catch (e) {
    res.json({ success: false, message: e.message || e });
  }
};

/**
 * Fetches the currently assigned permissions for a given designation.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getUserData = async (req, res, next) => {
  try {
    const data = await getUserDataService(req.params.id);
    res.send({ success: true, message: 'successfully fetched data', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
