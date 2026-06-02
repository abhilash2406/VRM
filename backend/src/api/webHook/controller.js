import { logger } from '../../config/winston-config.js';
import booking from '../../models/booking.js';

export const success = async (req, res) => {
  logger.info('1', req.body.data.envelopeSummary.recipients);

  try {
    let result = await booking.update(
      { signed: 'Signed' },
      {
        where: {
          envelopeId: req.body.data.envelopeId,
        },
      }
    );
    res.json(result);
  } catch (error) {
    logger.info(error);
  }
};
