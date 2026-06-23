import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Trips.
 * @typedef {import('sequelize').Model} Trip
 */
const trip = sequelize.define(
  'trip',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    truck_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    route_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    trip_status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'cancelled', 'completed'),
      allowNull: true,
      defaultValue: 'scheduled',
    },
    status: {
      type: DataTypes.ENUM(Object.values(EntityType)),
      allowNull: false,
      defaultValue: EntityType.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

trip.associate = (models) => {
  trip.belongsTo(models.driver, { foreignKey: 'driver_id', allowNull: false });
  trip.belongsTo(models.vehicle, { foreignKey: 'truck_id', allowNull: false });
  trip.belongsTo(models.route, { foreignKey: 'route_id', allowNull: false });
};

export default trip;
