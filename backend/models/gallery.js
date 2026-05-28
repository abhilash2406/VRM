import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const gallery = sequelize.define(
  'gallery',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
export default gallery;
