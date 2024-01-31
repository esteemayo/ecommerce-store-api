/* eslint-disable */
import { StatusCodes } from 'http-status-codes';

import AppError from './AppError.js';

class BadRequestError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
