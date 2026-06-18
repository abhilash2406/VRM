import transactions from '../../models/transaction.js';
import drivers from '../../models/driver.js';
import users from '../../models/users.js';

/**
 * Fetches all transaction records, including associations to drivers and users.
 * @returns {Promise<Array>} List of transaction objects.
 */
export const transactionListService = async () => {
  return await transactions.findAll({
    include: {
      model: drivers,
      include: [users],
    },
  });
};
