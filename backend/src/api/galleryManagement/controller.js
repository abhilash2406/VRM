import { uploadImagesService, retrieveImagesService, dltImagesService } from './service.js';

/**
 * Handles uploading an image to the gallery.
 * @param {import('express').Request} req - The Express request object containing the image file.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const uploadImages = async (req, res, next) => {
  try {
    await uploadImagesService(req.body, req.file);
    res.send({ success: true, message: 'image uploaded successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves all images from the gallery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const retrieveImages = async (req, res, next) => {
  try {
    const data = await retrieveImagesService();
    res.send({ success: true, message: 'image fetched successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes an image from the gallery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const dltImages = async (req, res) => {
  try {
    await dltImagesService(req.params.id);
    res.send({ success: true, message: 'image deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
