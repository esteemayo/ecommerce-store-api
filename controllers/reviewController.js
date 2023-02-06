/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Review from '../models/Review.js';
import APIFeatures from '../utils/apiFeatures.js';
import ForbiddenError from '../errors/forbidden.js';
import NotFoundError from '../errors/notFound.js';

const getReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  res.status(StatusCodes.OK).json(reviews);
});

const getTopReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.getTopReviews();

  res.status(StatusCodes.OK).json(reviews);
});

const getReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with the given ID ↔ ${reviewId}`)
    );
  }

  res.status(StatusCodes.OK).json(review);
});

const createReview = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.product) req.body.product = req.params.productId;

  const review = await Review.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(review);
});

const updateReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with the given ID ↔ ${reviewId}`)
    );
  }

  if (
    String(review.user._id) === req.user.id ||
    req.user.role === 'admin'
  ) {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(StatusCodes.OK).json(updatedReview);
  }

  return next(
    new ForbiddenError('Access denied! You do not have permission to perform this operation')
  );
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(
      new NotFoundError(`There is no review found with the given ID ↔ ${reviewId}`)
    );
  }

  if (
    String(review.user._id) === req.user.id ||
    req.user.role === 'admin'
  ) {
    await review.remove();

    return res.status(StatusCodes.NO_CONTENT).json({
      review: null,
    });
  }

  return next(
    new ForbiddenError('Access denied! You do not have permission to perform this operation')
  );
});


const reviewController = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};

export default reviewController;
