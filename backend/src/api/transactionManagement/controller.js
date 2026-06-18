import { transactionListService } from './service.js';

/**
 * Retrieves a list of all recorded driver transactions.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
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
