import Joi from 'joi';
import { failedResponse } from '../../common/response.js';

async function uploadFile(req, res, next) {
    try {
        const schema = Joi.object({
            image: Joi.object({
                name: Joi.string().required(),
                data: Joi.binary().required(),
                mimetype: Joi.string()
                    .valid(
                        'image/jpeg',
                        'image/png',
                        'image/jpg',
                        'application/pdf',
                        'application/xlsx',
                        'application/txt',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/msword',
                        'application/docx',
                        'application/docm'
                    )
                    .required()
                    .messages({
                        'any.only': 'Unsupported file format',
                        'string.empty': 'File type must not be empty.',
                        'any.required': 'File type is required.',
                    }),
                size: Joi.number().max(5242880).required().messages({
                    'number.base': 'File size must be a number.',
                    'number.max': 'File size must be less than or equal to 5MB.',
                    'any.required': 'File size is required.',
                }),
            })
                .required()
                .messages({
                    'any.required': 'Image is required.',
                    'object.base': 'Image must be provided as a file object.',
                }),
        });

        if (!req.files || !req.files.image) {
            return res.status(400).send(failedResponse('Image is required.', 400, 'ValidationError'));
        }

        req.files = await schema.validateAsync(req.files, { stripUnknown: true });
        return next();
    } catch (error) {
        return res.status(400).send(failedResponse(error.message, 400, 'ValidationError'));
    }
}

export default { uploadFile };
