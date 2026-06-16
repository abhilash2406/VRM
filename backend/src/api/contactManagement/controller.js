import { submitContactForm } from './service.js';

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
