import gallery from '../../models/gallery.js';

/**
 * Saves a new image path to the gallery database.
 * @param {Object} data - The gallery image payload.
 * @param {Object} file - The uploaded file object.
 * @returns {Promise<Object>} The created gallery record.
 */
export const uploadImagesService = async (data, file) => {
  const imagePath = file.path.replace(/^public/, '');
  data.image = imagePath;
  return await gallery.create(data);
};

/**
 * Fetches all gallery records.
 * @returns {Promise<Array>} List of gallery image objects.
 */
export const retrieveImagesService = async () => {
  return await gallery.findAll();
};

/**
 * Deletes a gallery image record by ID.
 * @param {string} id - The gallery image UUID.
 * @returns {Promise<boolean>} True if successfully deleted.
 * @throws {Error} If the image is not found.
 */
export const dltImagesService = async (id) => {
  const Gallery = await gallery.findByPk(id);
  if (!Gallery) {
    throw new Error('Image not found');
  }
  await Gallery.destroy();
  return true;
};
