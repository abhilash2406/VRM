import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const booking = sequelize.define('booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  envelopeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  signed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default booking;
