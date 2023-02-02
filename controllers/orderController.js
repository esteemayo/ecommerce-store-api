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

const orderController = {
  getOrders,
  getOrder,
  createOrder,
};

export default orderController;
