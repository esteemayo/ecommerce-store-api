import { StatusCodes } from 'http-status-codes';

const globalErrorHandler = (err, req, res, next) => {
  const customError = {
    stack: err.stack,
    status: err.status,
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (process.env.NODE_ENV === 'development') {
    res.status(res.statusCode).json({
      status: customError.status,
      message: customError.message,
      stack: customError.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(res.statusCode).json({
      status: customError.status,
      message: customError.message,
    });
  }
};

export default globalErrorHandler;
