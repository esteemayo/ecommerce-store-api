/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError.js';

class UnauthenticatedError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
