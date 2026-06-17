import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const loginHistory = sequelize.define(
  'loginHistory',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    loginTime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED'),
      defaultValue: 'SUCCESS',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'login_histories',
  }
);

loginHistory.associate = (models) => {
  loginHistory.belongsTo(models.users, {
    foreignKey: 'userId',
    allowNull: false,
  });
};

export default loginHistory;
