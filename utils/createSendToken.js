/* eslint-disable */
const createSendToken = (user, statusCode, req, res) => {
  const token = user.generateAuthToken();

  res.cookie('access_token', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

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
