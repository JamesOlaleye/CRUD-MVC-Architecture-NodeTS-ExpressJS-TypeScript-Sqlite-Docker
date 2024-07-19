import { config } from 'dotenv';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './config/db.config';

import noteRouter from './routes/note';
import usersRouter from './routes/users';
import homePage from './routes/page'

db.sync()
  .then(() => {
    console.log('database synced');
  })
  .catch((err) => {
    console.log('err syncing db', err);
  });

config();
const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log('LOGGED');
  next();
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  // app.use(myLogger);
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/notes', noteRouter);
app.use('/users', usersRouter);
app.use('/', homePage);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

