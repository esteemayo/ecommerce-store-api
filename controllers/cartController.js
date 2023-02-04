import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Cart from '../models/Cart.js';
import APIFeatures from '../utils/apiFeatures.js';
import ForbiddenError from '../errors/forbidden.js';
import NotFoundError from '../errors/notFound.js';

const getCarts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Cart.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const carts = await features.query;

  res.status(StatusCodes.OK).json(carts);
});

const getCart = asyncHandler(async (req, res, next) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return next(
      new NotFoundError(`There is no cart found with the given ID ↔ ${cartId}`)
    );
  }

  res.status(StatusCodes.OK).json(cart);
});

const createCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(cart);
});

const updateCart = asyncHandler(async (req, res, next) => { });

const deleteCart = asyncHandler(async (req, res, next) => { });

const cartController = {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
};

export default cartController;
