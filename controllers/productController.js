/* eslint-disable */
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Product from '../models/Product.js';
import NotFoundError from '../errors/notFound.js';

const getProducts = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach((item) => delete queryObj[item]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;

  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const products = await query;

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

  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProduct) {
    return next(
      new NotFoundError(`There is no product found with the given ID ↔ ${productId}`)
    );
  }

  res.status(StatusCodes.OK).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    return next(
      new NotFoundError(`There is no product found with the given ID ↔ ${productId}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    product: null,
  });
});

const productController = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
