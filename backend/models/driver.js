const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const driver = sequelize.define('driver', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  licenseNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licensePhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseType: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  shift: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dailyWage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bata: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('approved', 'reject', 'pending'),
    defaultValue: 'pending',
    allowNull: true,
  },
  truckId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  routeId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  loginId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});

driver.associate = (models) => {
  driver.belongsTo(models.login, { foreignKey: 'loginId', allowNull: true });
  driver.belongsTo(models.truck, { foreignKey: 'truckId', allowNull: true });
  driver.belongsTo(models.truck, { foreignKey: 'routeId', allowNull: true });
};

module.exports = driver;
