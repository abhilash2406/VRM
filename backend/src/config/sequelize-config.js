import Sequelize from 'sequelize';
import { database } from '../config/index.js';
import dns from 'dns';

// Neon DB drops connections if multiple IPs are attempted in parallel (Node 20+ Happy Eyeballs)
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return originalLookup(hostname, options, (err, address, family) => {
    if (err) return callback(err, address, family);
    // If net.connect requested all addresses, return only the first IPv4
    if (options && options.all && Array.isArray(address) && hostname.includes('neon.tech')) {
      const ipv4 = address.find((a) => a.family === 4) || address[0];
      return callback(null, [ipv4]);
    }
    return callback(null, address, family);
  });
};

const sequelize = new Sequelize(database);

export default sequelize;
