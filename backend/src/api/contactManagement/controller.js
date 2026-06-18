import { submitContactForm } from './service.js';

/**
 * Handles the submission of a contact form.
 * @param {import('express').Request} req - The Express request object containing contact details.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing the saved contact data.
 */
export const setContact = async (req, res, next) => {
  try {
    const data = await submitContactForm(req.body);
    res.send({
      success: true,
      message: 'message posted successfully',
      data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message || e,
    });
  }
};
