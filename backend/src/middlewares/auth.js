import { logger } from '../config/winston-config.js';
import jwt from 'jsonwebtoken';
import users from '../models/users.js';
// // authentication middleware

/**
 * Global authentication middleware.
 * Verifies JWT tokens present in the 'Authorization' header.
 * Skips authentication for public routes like /auth, /contact, and /gallery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export default async (req, res, next) => {
  try {
    if (
      req.originalUrl.startsWith('/auth') ||
      req.originalUrl.startsWith('/contact') ||
      req.originalUrl.startsWith('/gallery')
    )
      return next();
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return res.send({
        success: false,
        message: 'Unauthorized Access',
      });
    }

    // In users model we don't store tokens, we just verify the user logic
    // Previously we checked if the access_Token existed in the loginHistory
    // With JWT, verification is usually sufficient unless token invalidation is implemented in DB

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.send({
        success: false,
        message: 'Invalid token',
      });
    }
    if (decoded.exp < Date.now() / 1000) {
      return res.send({
        success: false,
        message: 'Token expired',
      });
    }
    const isAdminExists = await users.findOne({ where: { id: decoded.id } });
    if (!isAdminExists) {
      return res.send({
        success: false,
        message: 'Access Denied',
      });
    }
    let matchValidity = isAdminExists.password_hash
      .concat(isAdminExists.id)
      .concat(isAdminExists.email);
    if (matchValidity != decoded.validity) {
      return res.send({
        success: false,
        message: 'Access Denied',
      });
    }
    req.user = decoded;
    return next();
  } catch (ex) {
    console.error('TOKEN VERIFICATION ERROR:', ex);
    logger.info('error', ex);
    res.send({
      success: false,
      message: 'Invalid Token',
    });
  }
};
