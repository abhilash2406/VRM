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
import indexRouter from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';
import './models/index.js';
import './config/sequelize-config.js';
import inline_middlewares_auth from './middlewares/auth.js';
import { logger } from './config/winston-config.js';
dotenv.config();




var app = express();
app.use(
  session({
    secret: 'abhilash',
    resave: true,
    saveUninitialized: true,
  })
);


app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || '5000';
logger.info('==================================================');
logger.info(`🚀 Server is running locally on port: ${port}`);
logger.info(`📚 Swagger documentation available at: http://localhost:${port}/api`);
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

// app.all('/*', [inline_middlewares_auth, indexRouter]);

app.use('/', indexRouter)

// catch 404 and forward to error handler
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
