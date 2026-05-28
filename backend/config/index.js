import dotenvFlow from 'dotenv-flow';
import fs from 'fs';
dotenvFlow.config();
const env = process.env.NODE_ENV || 'local';
const configurations = JSON.parse(
  fs.readFileSync(new URL('./config.json', import.meta.url), 'utf-8')
);

const config = configurations[env] || configurations['development'] || configurations['local'];

export const database = config.database;
export const stripe = config.stripe;
export const mail = config.mail;
export const secretPass = config.secretPass;

export default config;
