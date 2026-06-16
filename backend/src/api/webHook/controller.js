import { handleSuccessWebhook } from './service.js';
import { logger } from '../../config/winston-config.js';

export const success = async (req, res) => {
  try {
    logger.info('1', req.body.data.envelopeSummary.recipients);
    const result = await handleSuccessWebhook(req.body);
    res.json(result);
  } catch (error) {
    logger.info(error);
    res.status(500).json({ error: error.message });
  }
};
