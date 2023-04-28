const transactions = require('../../models/transaction');
const drivers = require('../../models/driver');
const users = require('../../models/users');

exports.TransactionList = async (req, res, next) => {
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
