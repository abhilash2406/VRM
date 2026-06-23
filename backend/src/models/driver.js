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
    license_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    aadhar_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availability_status: {
      type: DataTypes.ENUM('AVAILABLE', 'ON_TRIP', 'ON_LEAVE', 'SICK'),
      allowNull: true,
      defaultValue: 'AVAILABLE',
    },
    rating: {
      type: DataTypes.FLOAT,
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
};

export default driver;
