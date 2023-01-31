/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError.js';

class BadRequestError extends AppError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
    this.status = 'error';
  }
}

export default BadRequestError;
