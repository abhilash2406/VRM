import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Login Histories.
 * @typedef {import('sequelize').Model} LoginHistory
 */
const loginHistory = sequelize.define(
  'loginHistory',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    login_time: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    login_status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED'),
      defaultValue: 'SUCCESS',
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(Object.values(EntityType)),
      allowNull: false,
      defaultValue: EntityType.ACTIVE,
    },
  },
  {
    timestamps: true,
    tableName: 'login_histories',
  }
);

loginHistory.associate = (models) => {
  loginHistory.belongsTo(models.users, {
    foreignKey: 'user_id',
    allowNull: false,
  });
};

export default loginHistory;
