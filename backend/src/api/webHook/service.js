import booking from '../../models/booking.js';

export const handleSuccessWebhook = async (data) => {
  return await booking.update(
    { signed: 'Signed' },
    {
      where: {
        envelopeId: data.data.envelopeId,
      },
    }
  );
};
