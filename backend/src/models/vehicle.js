import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

/**
 * Vehicle status enum values.
 */
export const VehicleStatus = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
};

/**
 * Vehicle type enum values.
 */
export const VehicleType = {
  TWO_WHEELER: 'two-wheeler',
  FOUR_WHEELER: 'four-wheeler',
  HEAVY_VEHICLE: 'heavy-vehicle',
};

/**
 * Sequelize Model for Vehicles.
 * @typedef {import('sequelize').Model} Vehicle
 */
const vehicle = sequelize.define(
  'vehicle',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'e.g. KL-01-AB-1234',
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g. Hyundai',
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g. Creta',
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'e.g. 2024',
    },
    status: {
      type: DataTypes.ENUM(Object.values(VehicleStatus)),
      allowNull: false,
      defaultValue: VehicleStatus.AVAILABLE,
    },
    vehicle_type: {
      type: DataTypes.ENUM(Object.values(VehicleType)),
      allowNull: false,
      defaultValue: VehicleType.FOUR_WHEELER,
      comment: 'two-wheeler | four-wheeler | heavy-vehicle',
    },
    rc_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'RC registration certificate number',
    },
    insurance_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    last_service_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_service_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    vehicle_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rc_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicle.associate = (models) => {
  vehicle.belongsTo(models.users, { foreignKey: 'created_by' });
};

export default vehicle;
