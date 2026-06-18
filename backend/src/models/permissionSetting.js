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
    designation_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    permission_id: {
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
    foreignKey: 'permission_id',
    allowNull: false,
  });
  permissionSetting.belongsTo(models.designation, {
    foreignKey: 'designation_id',
    allowNull: false,
  });
};

export default permissionSetting;
