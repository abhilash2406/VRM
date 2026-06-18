import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Drivers.
 * @typedef {import('sequelize').Model} Driver
 */
const driver = sequelize.define(
  'driver',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    license_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    daily_wage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bata: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(Object.values(EntityType)),
      allowNull: false,
      defaultValue: EntityType.ACTIVE,
    },
    truck_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    route_id: {
      type: DataTypes.UUID,

      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

driver.associate = (models) => {
  driver.belongsTo(models.users, { foreignKey: 'user_id' });
  driver.belongsTo(models.truck, { foreignKey: 'truck_id' });
  driver.belongsTo(models.route, {
    foreignKey: 'route_id',
  });
};

export default driver;
