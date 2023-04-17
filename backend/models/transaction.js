const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');


const transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driverId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});

transaction.associate = (models) => {
  transaction.belongsTo(models.driver, {
    foreignKey: 'driverId',
    allowNull: true,
  });
};

module.exports = transaction;
