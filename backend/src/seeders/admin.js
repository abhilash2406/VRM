import { logger } from '../config/winston-config.js';
import users from '../models/users.js';
import designation from '../models/designation.js'; // corrected import path based on relative position
import { UserType } from '../common/enum/user-type-enum.js';

(async () => {
  try {
    const adminData = {
      first_name: 'Abhilash ',
      email: process.env.ADMIN_MAIL,
      phone_number: '7012139732',
    };

    const designationDetails = await designation.findOne({
      where: { designation: UserType.SUPERADMIN },
    });

    let existingData = await users.findOne({
      where: { email: adminData.email },
    });

    if (!existingData) {
      await users.create({
        ...adminData,
        password_hash: process.env.ADMIN_PASS || 'AbhiLash@20', // Hook handles hashing
        designationId: designationDetails.id,
      });
      logger.info('Admin created successfully');
    } else {
      logger.info(`Data already exists`);
    }
  } catch (e) {
    console.error('Seeder Error:', e);
  }
})();
