import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signed: {
      type: DataTypes.ENUM('Signed', 'Unsigned'),
      defaultValue: 'Unsigned',
    },
    loginId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
  },
  {
    timestamps: true,
  }
);

users.associate = (models) => {
  users.belongsTo(models.login, { foreignKey: 'loginId', allowNull: false });
};

export default users;
