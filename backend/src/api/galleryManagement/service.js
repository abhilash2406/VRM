import gallery from '../../models/gallery.js';

export const uploadImagesService = async (data, file) => {
  const imagePath = file.path.replace(/^public/, '');
  data.image = imagePath;
  return await gallery.create(data);
};

export const retrieveImagesService = async () => {
  return await gallery.findAll();
};

export const dltImagesService = async (id) => {
  const Gallery = await gallery.findByPk(id);
  if (!Gallery) {
    throw new Error('Image not found');
  }
  await Gallery.destroy();
  return true;
};
