import express from 'express';
import morgan from 'morgan';
import 'colors';

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

export default app;
