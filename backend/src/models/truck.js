import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const truck = sequelize.define('truck', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variant: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VIN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engine_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chassis_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rc_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year_of_manufacture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rc_photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  truck_photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('working', 'not-working'),
    allowNull: true,
    defaultValue: 'working',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM(Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  },
  created_by: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
  },
});

truck.associate = (models) => {
  truck.belongsTo(models.users, { foreignKey: 'created_by' });
};

export default truck;
