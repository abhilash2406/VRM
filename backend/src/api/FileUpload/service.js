import b2Function from '../../utils/backblaze.js';
import BadRequest from '../../common/exceptions/badRequest.js';

export const handleFileUpload = async ({ image }) => {
  try {
    if (Array.isArray(image)) {
      return await Promise.all(
        image.map(async (e) => {
          const urlKey = await b2Function.uploadToB2(e?.name, e.data, e.mimetype);

          return {
            path: urlKey,
            size: e.size,
            url: await b2Function.generateB2PresignedUrl(urlKey),
          };
        })
      );
    }

    const urlKey = await b2Function.uploadToB2(image?.name, image.data, image.mimetype);

    return {
      path: urlKey,
      size: image.size,
      url: await b2Function.generateB2PresignedUrl(urlKey),
    };
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

export const deleteUploadedImage = async (name) => {
  try {
    if (!Array.isArray(name)) {
      return await b2Function.deleteFromB2(name);
    }

    await Promise.all(
      name.map((e) => {
        return b2Function.deleteFromB2(e);
      })
    );

    return null;
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
