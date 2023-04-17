const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');


const truck = sequelize.define('truck', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variant: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VIN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engineNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chassisNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RCNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yrManufacture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rcPhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  truckPhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('working', 'not-working'),
    allowNull: true,
    defaultValue: 'working',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'deactive', 'pending'),
    allowNull: true,
    defaultValue: 'active',
  },
  createdBy: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});

truck.associate = (models) => {
  truck.belongsTo(models.login, { foreignKey: 'createdBy', allowNull: true });
};

module.exports = truck;
