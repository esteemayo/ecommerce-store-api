/* eslint-disable */
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import AppError from '../errors/AppError.js';

const getUsers = asyncHandler(async (req, res, next) => {
  const query = req.query.new;

  const users = query
    ? await User.find().sort('-createdAt').limit(5)
    : await User.find().sort('-_id');

  res.status(StatusCodes.OK).json(users);
});

const getUserStats = asyncHandler(async (req, res, next) => { });

const getUser = asyncHandler(async (req, res, next) => { });

const updateUser = asyncHandler(async (req, res, next) => { });

const updateMe = asyncHandler(async (req, res, next) => { });

const deleteUser = asyncHandler(async (req, res, next) => { });

const deleteMe = asyncHandler(async (req, res, next) => { });

const createUser = (req, res, next) => { };

const getMe = (req, res, next) => { };

const userController = {
  getUsers,
  getUserStats,
  getUser,
  getMe,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe,
};

export default userController;
