import { logger } from '../config/winston-config.js';
import designation from '../models/designation.js';
import { UserType } from '../common/enum/user-type-enum.js';

(async () => {
  try {
    const designationData = Object.values(UserType);

    designationData.map(async (e) => {
      let existingData = await designation.findOne({
        where: { designation: e },
      });
      if (!existingData) {
        await designation.create({ designation: e });
        logger.info('Designation created successfully');
      } else {
        logger.info(`Data already exists`);
      }
    });
  } catch (e) {
    logger.info('error', e.message);
    process.exit(1);
  }
})();
