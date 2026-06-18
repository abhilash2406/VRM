import booking from '../../models/booking.js';

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
