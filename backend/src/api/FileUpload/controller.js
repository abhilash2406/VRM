import { handleFileUpload, deleteUploadedImage } from './service.js';
import { goodResponse } from '../../common/response.js';

export const fileUpload = async (req, res) => {
    const data = await handleFileUpload(req.files);
    return res.send(goodResponse({ data }, 'Image Uploaded Successfully'));
};

export const removeFileUpload = async (req, res) => {
    if (typeof req.body.name === 'string') {
        req.body.name = req.body?.name.split(',');
    }
    const data = await deleteUploadedImage(req.body.name);
    return res.send(goodResponse({ data }, 'Image Deleted Successfully'));
};
