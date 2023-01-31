const createSendToken = (user, statusCode, req, res) => {
  res.status(statusCode).json({
    status: 'success',
    ...user._doc,
  });
};

export default createSendToken;
