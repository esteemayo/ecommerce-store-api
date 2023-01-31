/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';

const register = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  if (user) {
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      ...user,
    });
  }
});

const login = asyncHandler(async (req, res, next) => { });

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
