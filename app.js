/* eslint-disable */
import express from 'express';
import morgan from 'morgan';
import 'colors';

import authRoute from './routes/auth.js';
import NotFoundError from './errors/notFound.js';
import userRoute from './routes/users.js';
import globalErrorHandler from './errors/errorHandler.js';

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

export default app;
