/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import BadRequestError from '../errors/badRequest.js';
import createSendToken from '../utils/createSendToken.js';
import createSendGoogleToken from '../utils/createSendGoogleToken';

const register = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  if (user) {
    createSendToken(user, StatusCodes.CREATED, req, res);
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new BadRequestError('Please provide username and password'));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new UnauthenticatedError('Incorrect email or password'));
  }

  createSendToken(user, StatusCodes.OK, req, res);
});

const googleLogin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return createSendGoogleToken(user, StatusCodes.OK, req, res);
  }

  const newUser = await User.create({
    ...req.body,
    fromGoogle: true,
  });

  createSendGoogleToken(newUser, StatusCodes.OK, req, res);
});

const forgotPassword = asyncHandler(async (req, res, next) => { });

const resetPassword = asyncHandler(async (req, res, next) => { });

const updatePasword = asyncHandler(async (req, res, next) => { });

const authController = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  updatePasword,
};

export default authController;
