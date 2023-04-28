const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

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
module.exports = gallery;
