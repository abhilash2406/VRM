const path = require('path');
require('dotenv-flow').config({ path: path.resolve(__dirname, '../../../') });
const dns = require('dns');

// Neon DB drops connections if multiple IPs are attempted in parallel (Node 20+ Happy Eyeballs)
const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return originalLookup(hostname, options, (err, address, family) => {
    if (err) return callback(err, address, family);
    if (options && options.all && Array.isArray(address) && hostname.includes('neon.tech')) {
      const ipv4 = address.find(a => a.family === 4) || address[0];
      return callback(null, [ipv4]);
    }
    return callback(null, address, family);
  });
};

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.DB_LOGGING === 'true',
};

if (process.env.DB_SSL === 'true') {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

module.exports = {
  development: dbConfig,
  local: dbConfig,
  test: dbConfig,
  production: dbConfig,
};
