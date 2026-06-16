import * as services from './service.js';

export const setContact = async (req, res, next) => {
  try {
    const data = await services.submitContactForm(req.body);
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
