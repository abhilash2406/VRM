const multer = require('multer');

const imageStorage = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const multiStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const multiUpload = multer({
  storage: multiStorage,
  limits: {
    fileSize: 10000000, //10 MB  ,
  },
  fileFilter(req, file, cb) {
    console.log('>>>>>??', file);

    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/PNG' ||
      file.mimetype === 'image/JPG' ||
      file.mimetype === 'image/JPEG' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }

    if (req.files.length > 5) {
      return cb(null, false, (req.lengthValidationError = true));
    }
    cb(undefined, true);
  },
});

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, data, cb) => {
    console.log('>>>>>??', data);
    if (
      data.mimetype === 'image/png' ||
      data.mimetype === 'image/jpg' ||
      data.mimetype === 'image/jpeg' ||
      data.mimetype === 'image/PNG' ||
      data.mimetype === 'image/JPG' ||
      data.mimetype === 'image/JPEG'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid image format'));
    }
  },
});

module.exports = { upload, multiUpload };
