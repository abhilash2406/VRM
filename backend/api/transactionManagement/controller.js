import transactions from '../../models/transaction.js';
import drivers from '../../models/driver.js';
import users from '../../models/users.js';

export const TransactionList = async (req, res, next) => {
  try {
    const data = await transactions.findAll({
      include: {
        model: drivers,
        include: [users],
      },
    });
    res.send({
      success: true,
      message: 'transaction listed',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
