import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

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
      type: DataTypes.ENUM('read', 'unread'),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default route;
