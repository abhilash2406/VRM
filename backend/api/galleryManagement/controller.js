const gallery = require('../../models/gallery');
const path = require('path');

exports.uploadImages = async (req, res, next) => {
  //   console.log("images")
  console.log('req.files', req.file);
  const imagePath = req.file.path.replace(/^public/, '');
  req.body.image = imagePath;
  await gallery.create(req.body);
};

exports.retrieveImages = async (req, res, next) => {
  try {
    const data = await gallery.findAll();
    res.send({
      success: true,
      data: data,
      message: 'image fetched successfully',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
//delete
exports.dltImages = async (req, res) => {
  const id = req.params.id;
  try {
    const Gallery = await gallery.findByPk(id);
    await Gallery.destroy();
    return res.send({
      success: true,
      message: 'image deleted successfully',
    });
  } catch (err) {
    return es.send({
      success: false,
      message: err.message,
    });
  }
};
