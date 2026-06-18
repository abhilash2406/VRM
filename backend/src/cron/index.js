import { inactiveUsersCron } from './inactiveUsersCron.js';

export const initCronJobs = () => {
  inactiveUsersCron();
  // Add other cron jobs here
};
