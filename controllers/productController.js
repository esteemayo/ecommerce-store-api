/* eslint-disable */
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Product from '../models/Product.js';

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(StatusCodes.OK).json(products);
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new NotFoundError(`There is no product found with the given ID ↔ ${productId}`)
    );
  }

  res.status(StatusCodes.OK).json(product);
});

const getProductBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });

  if (!product) {
    return next(
      new NotFoundError(`There is no product found with the given SLUG ↔ ${slug}`)
    );
  }

  res.status(StatusCodes.OK).json(product);
});

const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(product);
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(productId);

  if (!updatedProduct) {
    return next(
      new NotFoundError(`There is no product found with the given ID ↔ ${productId}`)
    );
  }

  res.status(StatusCodes.OK).json(updatedProduct);
});

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
