/* eslint-disable */
import { StatusCodes } from 'http-status-codes';

import AppError from './app.error.js';

class ForbiddenError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
