import cron from 'node-cron';
import users from '../models/users.js';
import { Op } from 'sequelize';
import moment from 'moment';
import { logger } from '../config/winston-config.js';

/**
 * Initializes the cron job to deactivate users who haven't logged in for 30 days.
 * Runs daily at midnight (00:00).
 */
export const inactiveUsersCron = () => {
  // Run every day at 12 AM (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running cron job: Check and update inactive users');

      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

      const [updatedRows] = await users.update(
        { status: 'INACTIVE' },
        {
          where: {
            status: 'ACTIVE',
            last_login: {
              [Op.lt]: thirtyDaysAgo,
            },
          },
        }
      );

      logger.info(`Cron job finished: Updated ${updatedRows} users to INACTIVE status.`);
    } catch (error) {
      logger.error('Error running inactive users cron job:', error);
    }
  });
};
