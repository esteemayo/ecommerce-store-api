import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Cart from '../models/Cart.js';
import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';

const getCarts = asyncHandler(async (req, res, next) => { });

const getCart = asyncHandler(async (req, res, next) => { });

const createCart = asyncHandler(async (req, res, next) => { });

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
