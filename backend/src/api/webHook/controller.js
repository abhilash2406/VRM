import { handleSuccessWebhook } from './service.js';
import { logger } from '../../config/winston-config.js';

/**
 * Handles incoming successful webhooks (e.g., from DocuSign) to update booking status.
 * @param {import('express').Request} req - The Express request object containing the webhook payload.
 * @param {import('express').Response} res - The Express response object.
 */
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
