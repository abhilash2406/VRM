import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize-config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../config/winston-config.js';
import { EntityType } from '../common/enum/activity-enum.js';

/**
 * Sequelize Model for Users.
 * @typedef {import('sequelize').Model} Users
 */
const users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation_id: {
      type: DataTypes.UUID,
      allowNull: true, // Making true for now, adapt if required
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(Object.values(EntityType)),
      allowNull: false,
      defaultValue: EntityType.INACTIVE,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blood_group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt();
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt();
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);

users.prototype.verifyPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password_hash);
};

users.prototype.generateAuthToken = function (rememberMe = false) {
  let numDays = rememberMe ? 720 : 10;
  const dateObj = new Date();
  const expiresIn = dateObj.setMinutes(dateObj.getMinutes() + numDays);

  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      validity: this.password_hash.concat(this.id).concat(this.email),
    },
    process.env.JWT_SECRET || 'qwerty',
    { expiresIn }
  );
};

users.associate = (models) => {
  users.hasMany(models.loginHistory, { foreignKey: 'user_id' });
  if (models.designation) {
    users.belongsTo(models.designation, { foreignKey: 'designation_id' });
  }
};

export default users;
