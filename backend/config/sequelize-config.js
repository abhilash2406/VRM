import Sequelize from 'sequelize';
import { database } from '../config/index.js';

const sequelize = new Sequelize(database);

export default sequelize;
