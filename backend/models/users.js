const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const users = sequelize.define('users', {
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
  loginId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});

users.associate = (models) => {
  users.belongsTo(models.login, { foreignKey: 'loginId', allowNull: false });
};

module.exports = users;
