/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Order from '../models/Order.js';
import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';

const getOrders = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res.status(StatusCodes.OK).json(orders);
});

const getUserOrder = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(StatusCodes.OK).json(orders);
});

const getMonthlyIncome = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(date.setMonth(lastMonth.getTime() - 1));

  const income = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: prevMonth },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        sales: '$total',
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: '$sales' },
      },
    },
  ]);

  res.status(StatusCodes.OK).json(income);
});

const getOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(
      new NotFoundError(`There is no order found with the given ID ↔ ${orderId}`)
    );
  }

  res.status(StatusCodes.OK).json(order);
});

const createOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(order);
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedOrder) {
    return next(
      new NotFoundError(`There is no order found with the given ID ↔ ${orderId}`)
    );
  }

  res.status(StatusCodes.OK).json(updatedOrder);
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    return next(
      new NotFoundError(`There is no order found with the given ID ↔ ${orderId}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    order: null,
  });
});

const orderController = {
  getOrders,
  getMonthlyIncome,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
};

export default orderController;
