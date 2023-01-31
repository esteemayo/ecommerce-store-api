/* eslint-disable */
const createSendToken = (user, statusCode, req, res) => {
  const { password, role, ...rest } = user._doc;

  const details = {
    ...rest,
  };

  res.status(statusCode).json({
    status: 'success',
    details,
    role,
  });
};

export default createSendToken;
