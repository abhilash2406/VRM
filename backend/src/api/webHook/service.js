import booking from '../../models/booking.js';

/**
 * Updates the booking status to 'Signed' based on a webhook payload.
 * @param {Object} data - The webhook payload.
 * @param {Object} data.data.envelope_id - The envelope ID from the signature provider.
 * @returns {Promise<Array<number>>} Sequelize update result array.
 */
export const handleSuccessWebhook = async (data) => {
  return await booking.update(
    { signed: 'Signed' },
    {
      where: {
        envelope_id: data.data.envelope_id,
      },
    }
  );
};
