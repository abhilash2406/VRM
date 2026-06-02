import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

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
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'cancelled', 'completed'),
      allowNull: true,
      defaultValue: 'scheduled',
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

export default trip;
