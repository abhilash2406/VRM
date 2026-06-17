import { logger } from '../config/winston-config.js';
import jwt from 'jsonwebtoken';
import users from '../models/users.js';
// // authentication middleware

export default async (req, res, next) => {
  try {
    if (
      req.originalUrl.startsWith('/auth') ||
      req.originalUrl.startsWith('/contact') ||
      req.originalUrl.startsWith('/gallery')
    )
      return next();
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
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
    if (decoded.exp < Date.now()) {
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
    logger.info('error', ex);
    res.send({
      success: false,
      message: 'Invalid Token',
    });
  }
};
