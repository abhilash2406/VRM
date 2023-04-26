// // authentication middleware

// const jwt = require('jsonwebtoken');
// const admin = require('../models/admin');

// module.exports = async (req, res, next) => {
//   try {
//     if (req.originalUrl.startsWith('/auth')) return next();
//     const token = req.header('Authorization')
//       ? req.header('Authorization').replace('Bearer ', '')
//       : null;
//     if (!token) {
//       return res.json({
//         success: false,
//         message: 'Unauthorized Access',
//       });
//     }

//     const access_Token = await admin.findOne({ token: token });
//     if (!access_Token) {
//       return res.json({
//         success: false,
//         msg: 'Invalid or Expired Token',
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.json({
//         success: false,
//         message: 'Invalid token',
//       });
//     }
//     if (decoded.exp < Date.now()) {
//       return res.json({
//         success: false,
//         message: 'Token expired',
//       });
//     }
//     const isAdminExists = await admin.findById(decoded.id);
//     if (!isAdminExists) {
//       return res.json({
//         success: false,
//         message: 'Access Denied',
//       });
//     }
//     let matchValidity = isAdminExists.password
//       .concat(isAdminExists._id)
//       .concat(isAdminExists.email);
//     if (matchValidity != decoded.validity) {
//       return res.json({
//         success: false,
//         message: 'Access Denied',
//       });
//     }
//     req.user = decoded;
//     return next();
//   } catch (ex) {
//     console.log('error', ex);
//     res.json({
//       success: false,
//       message: 'Invalid Token',
//     });
//   }
// };