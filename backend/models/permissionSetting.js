import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const permissionSetting = sequelize.define(
  'permissionSetting',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    designationId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

permissionSetting.associate = (models) => {
  permissionSetting.belongsTo(models.permission, {
    foreignKey: 'permissionId',
    allowNull: false,
  });
  permissionSetting.belongsTo(models.designation, {
    foreignKey: 'designationId',
    allowNull: false,
  });
};

export default permissionSetting;
