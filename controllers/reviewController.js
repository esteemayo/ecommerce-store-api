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

const reviewController = {
  getReviews,
};

export default reviewController;
