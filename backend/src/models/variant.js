import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Truck Variants.
 * @typedef {import('sequelize').Model} Variant
 */
const variant = sequelize.define(
  'variant',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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

export default variant;
