const path = require('path');
const fs = require('fs');
const sequelize = require('../config/sequelize-config');
// const basename = path.basename(__filename);
// const dirname = path.dirname(__filename);

const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
  );

(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    await import(`file://${path.resolve(__dirname, file)}`);
  }

  Object.values(sequelize.models).forEach((model) => {
    if (model.associate) {
      model.associate(sequelize.models);
    }
  });

  sequelize
    .sync({ force: false, alter: { drop: false } })
    .then(() => console.log('db sync done!'))
    .catch((e) => console.log(e.message));
})();
