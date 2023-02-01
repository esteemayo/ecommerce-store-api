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

const sendErrorDev = (err, res) =>
  res.status(res.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  res.status(res.statusCode).json({
    status: err.status,
    message: err.message,
  });

const globalErrorHandler = (err, req, res, next) => {
  const customError = {
    stack: err.stack,
    status: err.status,
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === 'CastError') handleCastErrorDB(customError, err);
  if (err.code && err.code === 11000) handleDuplicateErrorFieldsDB(customError, err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(customError, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(customError, res);
  }
};

export default globalErrorHandler;
