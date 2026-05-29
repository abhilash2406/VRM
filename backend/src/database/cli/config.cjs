const path = require('path');
require('dotenv-flow').config({ path: path.resolve(__dirname, '../../../') });

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.DB_LOGGING === 'true'
};

module.exports = {
  development: dbConfig,
  local: dbConfig,
  test: dbConfig,
  production: dbConfig
};
