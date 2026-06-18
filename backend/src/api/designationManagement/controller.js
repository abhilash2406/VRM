import { getDesignationsList } from './service.js';

/**
 * Retrieves a list of all non-Admin designations.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getDesignations = async (req, res, next) => {
  try {
    const data = await getDesignationsList();
    res.send({
      success: true,
      message: 'data retrieval success',
      data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message || e,
    });
  }
};
