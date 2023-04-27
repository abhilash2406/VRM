const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const permission = sequelize.define('permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  menu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subMenu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// permission.associate = (models) => {
//   permission.hasOne(models.permisionAllowed, {
//     foreignKey: { allowNull: false },
//   });
// };

module.exports = permission;
