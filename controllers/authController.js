/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import BadRequestError from '../errors/badRequest.js';

const register = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  if (user) {
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      ...user._doc,
    });
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

  return res.status(StatusCodes.OK).json({
    status: 'success',
    ...user._doc,
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => { });

const resetPassword = asyncHandler(async (req, res, next) => { });

const updatePasword = asyncHandler(async (req, res, next) => { });

const authController = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePasword,
};

export default authController;
