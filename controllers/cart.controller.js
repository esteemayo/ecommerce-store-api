/* eslint-disable */

import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Cart from '../models/cart.model.js';
import APIFeatures from '../utils/api.features.js';

import NotFoundError from '../errors/not.found.error.js';
import ForbiddenError from '../errors/forbidden.error.js';

export const getCarts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Cart.find({ user: req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const carts = await features.query;

  res.status(StatusCodes.OK).json(carts);
});

export const getCart = asyncHandler(async (req, res, next) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return next(
      new NotFoundError(`There is no cart found with the given ID ↔ ${cartId}`)
    );
  }

  res.status(StatusCodes.OK).json(cart);
});

export const createCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(cart);
});

export const updateCart = asyncHandler(async (req, res, next) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return next(
      new NotFoundError(`There is no cart found with the given ID ↔ ${cartId}`)
    );
  }

  if (String(cart.user) === req.user.id || req.user.role === 'admin') {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(StatusCodes.OK).json(updatedCart);
  }

  return next(
    new ForbiddenError(
      'Access denied! You do not have permission to perform this operation'
    )
  );
});

export const deleteCart = asyncHandler(async (req, res, next) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findById(cartId);

  if (!cart) {
    return next(
      new NotFoundError(`There is no cart found with the given ID ↔ ${cartId}`)
    );
  }

  if (String(cart.user) === req.user.id || req.user.role === 'admin') {
    await cart.remove();

    return res.status(StatusCodes.NO_CONTENT).json(null);
  }

  return next(
    new ForbiddenError(
      'Access denied! You do not have permission to perform this operation'
    )
  );
});
