/* eslint-disable */
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'colors';

import authRoute from './routes/auth.js';
import NotFoundError from './errors/notFound.js';
import userRoute from './routes/users.js';
import globalErrorHandler from './errors/errorHandler.js';
import categoryRoute from './routes/categories.js';
import productRoute from './routes/products.js';

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/products', productRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

export default app;
