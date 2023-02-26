import { StatusCodes } from 'http-status-codes';

const handleCastErrorDB = (customError, err) => {
  customError.message = `Invalid ${err.path}: ${err.value}`;
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleDuplicateErrorFieldsDB = (customError, err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  customError.message = `Duplicate field value: ${value}, Please use another value`;
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleValidationErrorDB = (customError, err) => {
  customError.message = Object.values(err.errors)
    .map((item) => item.message)
    .join(', ');
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleJWTError = (customError) => {
  customError.message = 'Invalid token. Please log in again';
  customError.statusCode = StatusCodes.UNAUTHORIZED;
};

const handleJWTExpiredError = (customError) => {
  customError.message = 'Your token has expired! Please log in again';
  customError.statusCode = StatusCodes.UNAUTHORIZED;
};

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    stack: err.stack,
    status: err.status,
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === 'CastError') handleCastErrorDB(customError, err);
  if (err.code && err.code === 11000) handleDuplicateErrorFieldsDB(customError, err);
  if (err.name === 'ValidationError') handleValidationErrorDB(customError, err);
  if (err.name === 'JsonWebTokenError') handleJWTError(customError);
  if (err.name === 'TokenExpiredError') handleJWTExpiredError(customError);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(customError, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(customError, res);
  }
};

export default globalErrorHandler;
