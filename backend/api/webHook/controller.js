const users = require('../../models/users');

exports.success = async (req, res) => {
  console.log('1', req.body.data.envelopeSummary.recipients);

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
    console.log(error);
  }
};
