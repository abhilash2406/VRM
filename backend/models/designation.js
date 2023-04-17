const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');


const designation = sequelize.define(
  'designation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = designation;
