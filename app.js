/* eslint-disable */
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import dotenv from 'dotenv';
import 'colors';

import authRoute from './routes/auth.js';
import NotFoundError from './errors/notFound.js';
import userRoute from './routes/users.js';
import orderRoute from './routes/orders.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js';
import categoryRoute from './routes/categories.js';
import reviewRoute from './routes/reviews.js';
import productRoute from './routes/products.js';
import cartRoute from './routes/carts.js';
import stripeRoute from './routes/stripe.js';

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());

if (!process.env.JWT_SECRET) {
  process.exit(1);
}

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in 30 minutes',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(hpp());

app.use(xss());

app.use(compression());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/carts', cartRoute);
app.use('/api/v1/checkout', stripeRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandlerMiddleware);

export default app;
