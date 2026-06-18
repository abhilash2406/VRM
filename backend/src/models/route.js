import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Routes.
 * @typedef {import('sequelize').Model} Route
 */
const route = sequelize.define(
  'route',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locations: {
      type: DataTypes.ARRAY(
        DataTypes.JSON({
          longitude: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          latitude: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        })
      ),
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

export default route;
