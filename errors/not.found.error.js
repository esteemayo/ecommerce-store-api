/* eslint-disable */
import { StatusCodes } from 'http-status-codes';

import AppError from './app.error.js';

class NotFoundError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
