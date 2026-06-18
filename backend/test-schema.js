import './models/index.js';
import sequelize from './config/sequelize-config.js';

setTimeout(() => {
  for (const name in sequelize.models) {
    console.log(name, Object.keys(sequelize.models[name].rawAttributes));
  }
  process.exit(0);
}, 2000);
