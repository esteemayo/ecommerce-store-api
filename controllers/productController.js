/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Product from '../models/Product.js';

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(StatusCodes.OK).json(products);
});

const getProductById = asyncHandler(async (req, res, next) => { });

const getProductBySlug = asyncHandler(async (req, res, next) => { });

const createProduct = asyncHandler(async (req, res, next) => { });

const updateProduct = asyncHandler(async (req, res, next) => { });

const deleteProduct = asyncHandler(async (req, res, next) => { });

const productController = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
