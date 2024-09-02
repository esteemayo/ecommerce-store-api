/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';

import Product from '../models/product.model.js';
import NotFoundError from '../errors/not.found.error.js';

export const getProducts = asyncHandler(async (req, res, next) => {
  const queryObj = {};
  const { name, featured, category, sort, fields, numericFilter } = req.query;

  if (name) {
    queryObj.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    queryObj.category = category;
  }

  if (featured) {
    queryObj.featured = featured === 'true' ? true : false;
  }

  if (numericFilter) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = [
      'price',
      'priceDiscount',
      'numberInStock',
      'ratingsQuantity',
      'ratingsAverage',
    ];

    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObj[field] = { [operator]: +value };
      }
    });
  }

  let query = Product.find(queryObj);

  if (sort) {
    const sortBy = sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    query = query.select(fieldsList);
  } else {
    query = query.select('-__v');
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const skip = (page - 1) * limit;

  const counts = await Product.countDocuments({
    ...(category ? { category } : {}),
  });

  const numberOfPages = Math.ceil(counts / limit);

  query = query.skip(skip).limit(limit);

  const products = await query;

  res.status(StatusCodes.OK).json({
    page,
    counts,
    numberOfPages,
    products,
  });
});

export const getProductStats = asyncHandler(async (req, res, next) => {
  const stats = await Product.getProductStats();

  res.status(StatusCodes.OK).json(stats);
});

export const getProductByTags = asyncHandler(async (req, res, next) => {
  const tags = req.query.tags.split(',');

  const products = await Product.find({ tags: { $in: tags } }).sort('-_id');

  res.status(StatusCodes.OK).json(products);
});

export const getCountByCategory = asyncHandler(async (req, res, next) => {
  const shirtCountPromise = Product.countDocuments({ category: 'shirts' });
  const gadgetCountPromise = Product.countDocuments({ category: 'gadgets' });
  const electronicCountPromise = Product.countDocuments({
    category: 'electronics',
  });
  const jeanCountPromise = Product.countDocuments({ category: 'jeans' });
  const fruitCountPromise = Product.countDocuments({ category: 'snickers' });

  const [shirtCount, gadgetCount, electronicCount, jeanCount, fruitCount] =
    await Promise.all([
      shirtCountPromise,
      gadgetCountPromise,
      electronicCountPromise,
      jeanCountPromise,
      fruitCountPromise,
    ]);

  res.status(StatusCodes.OK).json([
    { category: 'shirts', count: shirtCount },
    { category: 'gadgets', count: gadgetCount },
    { category: 'electronics', count: electronicCount },
    { category: 'jeans', count: jeanCount },
    { category: 'snickers', count: fruitCount },
  ]);
});

export const searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  const products = await Product.find({
    name: { $regex: query, $options: 'i' },
  }).sort('-_id');

  res.status(StatusCodes.OK).json(products);
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId).populate('reviews');

  if (!product) {
    return next(
      new NotFoundError(
        `There is no product found with the given ID ↔ ${productId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(product);
});

export const getProductBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug }).populate('reviews');

  if (!product) {
    return next(
      new NotFoundError(
        `There is no product found with the given SLUG ↔ ${slug}`
      )
    );
  }

  res.status(StatusCodes.OK).json(product);
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(product);
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(
      new NotFoundError(
        `There is no product found with the given ID ↔ ${productId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(updatedProduct);
});

export const likeProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  let product = await Product.findById(productId);

  if (!product) {
    return next(
      new NotFoundError(
        `There is no product found with the given ID ↔ ${productId}`
      )
    );
  }

  const likeIndex = product.likes.findIndex(
    (userId) => userId === String(req.user.id)
  );

  if (likeIndex !== -1) {
    product.likes = product.likes.filter(
      (userId) => userId !== String(req.user.id)
    );
  } else {
    product.likes.push(req.user.id);
  }

  product = await Product.findByIdAndUpdate(
    productId,
    { $set: { ...product } },
    { new: true }
  );

  res.status(StatusCodes.OK).json(product);
});

export const updateViews = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $inc: { views: 1 },
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(
      new NotFoundError(
        `There is no product found with the given ID ↔ ${productId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(product);
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    return next(
      new NotFoundError(
        `There is no product found with the given ID ↔ ${productId}`
      )
    );
  }

  res.status(StatusCodes.NO_CONTENT).json(null);
});
