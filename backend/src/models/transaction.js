import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  driver_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  status: {
    type: DataTypes.ENUM(Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  },
});

transaction.associate = (models) => {
  transaction.belongsTo(models.driver, {
    foreignKey: 'driver_id',
    allowNull: true,
  });
};

export default transaction;
