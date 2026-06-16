import { getDesignationsList } from './service.js';

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
