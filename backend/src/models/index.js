import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import fs from 'fs';
import sequelize from '../config/sequelize-config.js';
// const basename = path.basename(__filename);
// const dirname = path.dirname(__filename);
import { logger } from '../config/winston-config.js';

const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js'
  );

(async () => {
  for (const file of files) {
    await import(`file://${path.resolve(__dirname, file)}`);
  }

  Object.values(sequelize.models).forEach((model) => {
    if (model.associate) {
      model.associate(sequelize.models);
    }
  });

  sequelize
    .authenticate()
    .then(() => logger.info('✅ Database connected successfully! (Auto-sync disabled)'))
    .catch((e) => logger.error(e.message));
})();
