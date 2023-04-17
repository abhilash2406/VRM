const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');


const route = sequelize.define('route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('read', 'unread'),
    allowNull: true,
  },
});

module.exports = route;
