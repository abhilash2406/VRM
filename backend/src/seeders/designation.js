import { logger } from '../../config/winston-config.js';
import designation from '../designation.js';

(async () => {
  try {
    const designationData = ['Admin', 'Driver', 'Manager', 'Sales'];

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
