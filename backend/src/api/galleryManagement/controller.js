import * as services from './service.js';

export const uploadImages = async (req, res, next) => {
  try {
    await services.uploadImagesService(req.body, req.file);
    res.send({ success: true, message: 'image uploaded successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const retrieveImages = async (req, res, next) => {
  try {
    const data = await services.retrieveImagesService();
    res.send({ success: true, message: 'image fetched successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const dltImages = async (req, res) => {
  try {
    await services.dltImagesService(req.params.id);
    res.send({ success: true, message: 'image deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
