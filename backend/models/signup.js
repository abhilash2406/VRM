const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const signup = sequelize.define('signup', {
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

signup.associate = (models) => {
  signup.belongsTo(models.login, { foreignKey: 'loginId', allowNull: false });
};

module.exports = signup;
