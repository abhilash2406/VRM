import basicAuth from 'basic-auth';

/**
 * Basic Authentication middleware to protect Swagger documentation in production/staging environments.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const swaggerAuth = (req, res, next) => {
  const env = process.env.NODE_ENV;

  if (env === 'production' || env === 'staging') {
    const user = basicAuth(req);

    const username = process.env.SWAGGER_USERNAME;
    const password = process.env.SWAGGER_PASSWORD;

    if (!user || user.name !== username || user.pass !== password) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger UI"');
      res.status(401).send('Authentication required.');
      return;
    }
  }

  next();
};

export default swaggerAuth;
