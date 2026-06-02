import { logger } from '../../config/winston-config.js';
import signup from '../users.js';
import login from '../login.js';
import designation from '../designation.js';

const hashing = async (password) => {
  const salt = await login.generateSalt();
  let newPassword = await login.hashPassword(password, salt);
  return { salt, newPassword };
};

(async () => {
  try {
    let { salt, newPassword } = await hashing('AbhiLash@20');

    const adminData = {
      name: 'Abhilash ',
      email: 'abhilashkumar@spericorn.com',
      phoneNumber: '7012139732',
    };

    const designationDetails = await designation.findOne({
      where: { designation: 'Admin' },
    });

    let existingData = await login.findOne({
      where: { email: adminData.email },
    });

    if (!existingData) {
      const loginDetails = await login.create({
        ...adminData,
        password: newPassword,
        salt,
        designationId: designationDetails.id,
      });
      logger.info('Admin created successfully');
      await signup.create({
        ...adminData,
        loginId: loginDetails.id,
      });
    } else {
      logger.info(`Data already exists`);
    }
  } catch (e) {
    logger.info('error', e.message);
  }
})();
