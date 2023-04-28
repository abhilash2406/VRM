const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const trip = sequelize.define(
  'trip',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    driverId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    truckId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    routeId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
  },
  {
    timestamps: true,
  }
);

trip.associate = (models) => {
  trip.belongsTo(models.driver, { foreignKey: 'driverId', allowNull: false });
  trip.belongsTo(models.truck, { foreignKey: 'truckId', allowNull: false });
  trip.belongsTo(models.route, { foreignKey: 'routeId', allowNull: false });
};

module.exports = trip;
