import { transactionListService } from './service.js';

export const TransactionList = async (req, res, next) => {
  try {
    const data = await transactionListService();
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
