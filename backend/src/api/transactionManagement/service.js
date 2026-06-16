import transactions from '../../models/transaction.js';
import drivers from '../../models/driver.js';
import users from '../../models/users.js';

export const transactionListService = async () => {
  return await transactions.findAll({
    include: {
      model: drivers,
      include: [users],
    },
  });
};
