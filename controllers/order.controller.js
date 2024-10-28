/* eslint-disable */

import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Order from '../models/order.model.js';
import APIFeatures from '../utils/api.features.js';

import NotFoundError from '../errors/not.found.error.js';
import ForbiddenError from '../errors/forbidden.error.js';

export const getOrders = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res.status(StatusCodes.OK).json(orders);
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const orders = await Order.find({ user: userId });

  res.status(StatusCodes.OK).json(orders);
});

export const getMonthlyIncome = asyncHandler(async (req, res, next) => {
  const income = await Order.getMonthlyIncome();

  res.status(StatusCodes.OK).json(income);
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(
      new NotFoundError(
        `There is no order found with the given ID ↔ ${orderId}`
      )
    );
  }

  if (String(order.user) === req.user.id || req.user.role === 'admin') {
    return res.status(StatusCodes.OK).json(order);
  }

  return next(
    new ForbiddenError(
      'Access denied! You do not have permission to perform this operation'
    )
  );
});

export const createOrder = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const order = await Order.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(order);
});

export const updateOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedOrder) {
    return next(
      new NotFoundError(
        `There is no order found with the given ID ↔ ${orderId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(updatedOrder);
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    return next(
      new NotFoundError(
        `There is no order found with the given ID ↔ ${orderId}`
      )
    );
  }

  res.status(StatusCodes.NO_CONTENT).json(null);
});
