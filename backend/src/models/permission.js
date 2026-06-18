import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

/**
 * Sequelize Model for Permissions.
 * @typedef {import('sequelize').Model} Permission
 */
const permission = sequelize.define(
  'permission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    menu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_menu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// permission.associate = (models) => {
//   permission.hasOne(models.permisionAllowed, {
//     foreignKey: { allowNull: false },
//   });
// };

export default permission;
