import fileUpload from 'express-fileupload';
import path from 'path';
import BadRequest from '../exceptions/badRequest.js';

export const ImageMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'image/heic',
  'image/heif',
];

export const DocumentMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const FileMimeTypes = [...ImageMimeTypes, ...DocumentMimeTypes];

const getAllowedMimeTypes = (allowedTypes) => {
  if (Array.isArray(allowedTypes)) {
    return allowedTypes;
  }
  switch (allowedTypes) {
    case 'image':
      return ImageMimeTypes;
    case 'document':
      return DocumentMimeTypes;
    case 'file':
      return FileMimeTypes;
    default:
      throw new BadRequest(`Unknown allowedTypes keyword: ${allowedTypes}`);
  }
};

const fileValidation = ({ file, allowedTypes, maxSizeMB, required = false, maxFiles }) => {
  if (required && !file) {
    throw new BadRequest('File is required');
  }

  const files = file ? (Array.isArray(file) ? file : [file]) : [];

  const maxSize = maxSizeMB * 1024 * 1024;

  const allowedMimeTypes = getAllowedMimeTypes(allowedTypes);

  if (maxFiles && files.length > maxFiles) {
    throw new BadRequest(`Only up to ${maxFiles} file(s) are allowed`);
  }

  files.forEach((f) => {
    if (f.size > maxSize) {
      throw new BadRequest(`File exceeds maximum size of ${maxSizeMB} MB`);
    }

    const fileType = f.mimetype || path.extname(f.name).toLowerCase();

    if (!allowedMimeTypes.includes(fileType)) {
      throw new BadRequest(`Invalid file type. Allowed types are: ${allowedMimeTypes.join(', ')}`);
    }
  });
};

// Configure base express-fileupload middleware
const handleUpload = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB global limit
  abortOnLimit: true,
  createParentPath: true, // Auto-create public/images if it doesn't exist
});

// Helper to save file and mimic multer's object structure
const saveFile = async (file) => {
  const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '_')}`;
  const uploadPath = path.join('public', 'images', filename);

  await file.mv(uploadPath);

  // Return an object that looks exactly like what controllers expect from multer
  return {
    path: uploadPath,
    filename: filename,
    originalname: file.name,
    mimetype: file.mimetype,
    size: file.size,
  };
};

export const upload = {
  single: (fieldName) => [
    handleUpload,
    async (req, res, next) => {
      try {
        if (!req.files || !req.files[fieldName]) {
          return next(); // Proceed without file if not required by Multer
        }

        let file = req.files[fieldName];
        if (Array.isArray(file)) {
          file = file[0]; // .single() only expects one
        }

        // Run the custom validation
        fileValidation({ file, allowedTypes: ImageMimeTypes, maxSizeMB: 2 });

        // Save to disk and attach to req.file
        req.file = await saveFile(file);

        next();
      } catch (err) {
        next(err);
      }
    },
  ],
  fields: (fieldsArray) => [
    handleUpload,
    async (req, res, next) => {
      try {
        req.multerFiles = {};

        if (!req.files) return next();

        for (const field of fieldsArray) {
          const fieldName = field.name;
          if (req.files[fieldName]) {
            let files = req.files[fieldName];
            if (!Array.isArray(files)) {
              files = [files];
            }

            // Limit check based on maxCount
            if (field.maxCount && files.length > field.maxCount) {
              files = files.slice(0, field.maxCount);
            }

            // Run the custom validation
            fileValidation({ file: files, allowedTypes: FileMimeTypes, maxSizeMB: 10 });

            // Save to disk and construct array
            const savedFiles = [];
            for (const f of files) {
              savedFiles.push(await saveFile(f));
            }

            req.multerFiles[fieldName] = savedFiles;
          }
        }

        // Overwrite express-fileupload's req.files with our new multer-compatible object
        req.files = req.multerFiles;
        next();
      } catch (err) {
        next(err);
      }
    },
  ],
};

// Also export as multiUpload for backwards compatibility
export const multiUpload = upload;
export default { upload, multiUpload, fileValidation };
