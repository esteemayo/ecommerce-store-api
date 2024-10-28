/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/top', reviewController.getTopReviews);

router.get('/total-reviews/:id', reviewController.getTotalReviewsOnProduct);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.createReview
  );

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
