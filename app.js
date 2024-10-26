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

import authRoute from './routes/auth.route.js';
import orderRoute from './routes/orders.route.js';
import userRoute from './routes/users.route.js';
import productRoute from './routes/products.route.js';
import cartRoute from './routes/carts.route.js';
import reviewRoute from './routes/reviews.route.js';
import stripeRoute from './routes/stripe.route.js';
import categoryRoute from './routes/categories.route.js';

import NotFoundError from './errors/not.found.error.js';
import errorHandlerMiddleware from './middlewares/error.handler.middleware.js';

dotenv.config({ path: './config.env' });

const app = express();

const devEnv = process.env.NODE_ENV !== 'production';
const { DEV_URL, PROD_URL } = process.env;

const origin = devEnv ? DEV_URL : PROD_URL;

app.set('trust proxy', 1);

app.use(cors({ origin, credentials: true }));
app.options('*', cors());

app.use(helmet());

if (!process.env.JWT_SECRET) {
  process.exit(1);
}

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 3000,
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
