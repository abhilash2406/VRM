import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const gallery = sequelize.define(
  'gallery',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    image: {
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
export default gallery;
