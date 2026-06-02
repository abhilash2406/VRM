import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';

const driver = sequelize.define(
  'driver',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    licenseNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userPhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dailyWage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bata: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('approved', 'reject', 'pending'),
      defaultValue: 'pending',
      allowNull: true,
    },
    truckId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    routeId: {
      type: DataTypes.UUID,

      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

driver.associate = (models) => {
  driver.belongsTo(models.users, { foreignKey: 'userId' });
  driver.belongsTo(models.truck, { foreignKey: 'truckId' });
  driver.belongsTo(models.route, {
    foreignKey: 'routeId',
  });
};

export default driver;
