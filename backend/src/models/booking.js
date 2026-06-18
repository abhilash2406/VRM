import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

const booking = sequelize.define('booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  envelope_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  signed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(Object.values(EntityType)),
    allowNull: false,
    defaultValue: EntityType.ACTIVE,
  },
});

export default booking;
