/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError.js';

class NotFoundError extends AppError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.NOT_FOUND;
    this.status = 'error';
  }
}

export default NotFoundError;
