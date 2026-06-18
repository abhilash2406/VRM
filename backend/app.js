import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import express from 'express';
import path from 'path';
import morganLogger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import indexRouter from './src/routes/index.js';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './src/config/swagger.js';
import './src/models/index.js';
import './src/config/sequelize-config.js';
import { logger } from './src/config/winston-config.js';
import swaggerAuth from './src/middlewares/swagger-auth.js';

import { connectRedis } from './src/config/redis-config.js';

dotenv.config();

// Connect to Redis before starting
connectRedis();

import { initCronJobs } from './src/cron/index.js';
// Initialize cron jobs
initCronJobs();

var app = express();
app.use(helmet());
app.use(compression());
app.use(
  session({
    secret: 'abhilash',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  '/api-docs',
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

const port = process.env.PORT || '5000';
logger.info('==================================================');
logger.info(`🚀 Server is running locally on port: ${port}`);
logger.info(`📚 Swagger documentation available at: http://localhost:${port}/api-docs`);
logger.info('==================================================');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(morganLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// File upload parsing is already handled locally by the wrapper in middlewares/uploader.js
// so we don't apply it globally here to avoid double-parsing conflicts.
// app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register API routes (using your existing indexRouter)
app.use('/api/v1', indexRouter);
// If you want to keep the root path working as before, uncomment below:
// app.use('/', indexRouter);

app.use((_req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// catch 404 and forward to error handler (for non-JSON routes)
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
