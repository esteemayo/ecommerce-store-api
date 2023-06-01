/* eslint-disable */
import _ from 'lodash';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import BadRequestError from '../errors/badRequest.js';
import NotFoundError from '../errors/notFound.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import createSendToken from '../utils/createSendToken.js';

const getUsers = asyncHandler(async (req, res, next) => {
  const query = req.query.new;

  const users = query
    ? await User.find().sort('-createdAt').limit(5)
    : await User.find().sort('-_id');

  res.status(StatusCodes.OK).json(users);
});

const getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await User.getUserStats();

  res.status(StatusCodes.OK).json(stats);
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with the given ID ↔ ${userId}`)
    );
  }

  res.status(StatusCodes.OK).json(user);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (updatedUser) {
    return next(
      new NotFoundError(`There is no user found with the given ID ↔ ${userId}`)
    );
  }

  res.status(StatusCodes.OK).json(updatedUser);
});

const updateMe = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${req.protocol
        }://${req.get('host')}/api/v1/auth/update-my-password`
      )
    );
  }

  const filterBody = _.pick(req.body, ['name', 'email', 'username', 'image']);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...filterBody } },
    {
      new: true,
      runValidators: true,
    },
  );

  createSendToken(updatedUser, StatusCodes.OK, req, res);
});

const updateEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Please provide email and password'));
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new UnauthenticatedError('Your password is incorrect'));
  }

  user.email = email;
  await user.save();

  createSendToken(user, StatusCodes.OK, req, res);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (user) {
    return next(
      new NotFoundError(`There is no user found with the given ID ↔ ${userId}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json(null);
});

const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).json(null);
});

const createUser = (req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/register`,
  });
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const userController = {
  getUsers,
  getUserStats,
  getUser,
  getMe,
  createUser,
  updateUser,
  updateEmail,
  updateMe,
  deleteUser,
  deleteMe,
};

export default userController;
