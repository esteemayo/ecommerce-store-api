/* eslint-disable */
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';
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

  const counts = await Product.countDocuments();
  query = query.skip(skip).limit(limit);

  const products = await query;

  res.status(StatusCodes.OK).json(products);
});

const getProductStats = asyncHandler(async (req, res, next) => {
  const stats = await Product.getProductStats();

  res.status(StatusCodes.OK).json(stats);
});

const getProductByTags = asyncHandler(async (req, res, next) => {
  const tags = req.query.tags.split(',');

  const features = new APIFeatures(Product.find({ tags: { $in: tags } }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(StatusCodes.OK).json(products);
});

const getCountByCategory = asyncHandler(async (req, res, next) => {
  const shirtCountPromise = Product.countDocuments({ category: 'shirts' });
  const gadgetCountPromise = Product.countDocuments({ category: 'gadgets' });
  const electronicCountPromise = Product.countDocuments({ category: 'electronics' });
  const jeanCountPromise = Product.countDocuments({ category: 'jeans' });
  const fruitCountPromise = Product.countDocuments({ category: 'fruits' });

  const [
    shirtCount,
    gadgetCount,
    electronicCount,
    jeanCount,
    fruitCount
  ] = await Promise.all(
    [
      shirtCountPromise,
      gadgetCountPromise,
      electronicCountPromise,
      jeanCountPromise,
      fruitCountPromise
    ]
  );

  res.status(StatusCodes.OK).json([
    { category: 'shirts', count: shirtCount },
    { category: 'gadgets', count: gadgetCount },
    { category: 'electronics', count: electronicCount },
    { category: 'jeans', count: jeanCount },
    { category: 'fruits', count: fruitCount },
  ]);
});

const searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  const products = await Product.find({
    name: { $regex: query, $options: 'i' },
  }).sort('-_id');

  res.status(StatusCodes.OK).json(products);
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId).populate('reviews');

  if (!product) {
    return next(
      new NotFoundError(`There is no product found with the given ID ↔ ${productId}`)
    );
  }

  res.status(StatusCodes.OK).json(product);
});

const getProductBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug }).populate('reviews');

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

  res.status(StatusCodes.NO_CONTENT).json(null);
});

const productController = {
  getProducts,
  getProductStats,
  getProductByTags,
  getCountByCategory,
  searchProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
