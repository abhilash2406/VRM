import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

export const RequiredEnvVars = [
  'DB_HOST',
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_PORT',
  'DB_LOGGING',
  'DB_DIALECT',
  'JWT_SECRET',
  'USER_MAIL',
  'PASS',
  'NODE_ENV',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'MAIL_HOST',
  'MAIL_SERVICE',
  'MAIL_EMAIL',
  'MAIL_PASS',
  'SECRET_PASS',
];

export const validateEnvironmentVars = () => {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development';
  }

  RequiredEnvVars.forEach((v) => {
    if (!process.env[v]) {
      throw Error(`Missing required env variable ${v}`);
    }
  });
};

export const configuration = () => {
  validateEnvironmentVars();

  const defaultConfiguration = {
    database: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT,
      port: Number(process.env.DB_PORT),
      logging: process.env.DB_LOGGING === 'true',
    },
    stripe: {
      publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
      secret_key: process.env.STRIPE_SECRET_KEY,
    },
    mail: {
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      email: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASS,
    },
    secretPass: process.env.SECRET_PASS,
  };
  return defaultConfiguration;
};

const config = configuration();

export const database = config.database;
export const stripe = config.stripe;
export const mail = config.mail;
export const secretPass = config.secretPass;

export default config;
