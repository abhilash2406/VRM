import jwt from 'jsonwebtoken';
import login from '../models/login.js';
import { Op } from 'sequelize';
// // authentication middleware


export default async (req, res, next) => {;
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

    const access_Token = await login.findOne({ where: { token: token } });
    if (!access_Token) {
      return res.send({
        success: false,
        msg: 'Invalid or Expired Token',
      });
    }

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
    const isAdminExists = await login.findOne({ where: { id: decoded.id } });
    if (!isAdminExists) {
      return res.send({
        success: false,
        message: 'Access Denied',
      });
    }
    let matchValidity = isAdminExists.password
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
    console.log('error', ex);
    res.send({
      success: false,
      message: 'Invalid Token',
    });
  }
};
