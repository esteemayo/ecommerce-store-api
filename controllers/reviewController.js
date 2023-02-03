/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Review from '../models/Review.js';
import APIFeatures from '../utils/apiFeatures.js';

const getReviews = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query();

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

const updateReview = asyncHandler(async (req, res, next) => { });

const deleteReview = asyncHandler(async (req, res, next) => { });


const reviewController = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};

export default reviewController;
