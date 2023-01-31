/* eslint-disable */
import express from 'express';
import morgan from 'morgan';
import 'colors';

import NotFoundError from './errors/notFound.js';

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

export default app;
