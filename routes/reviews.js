/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(authMiddleware.restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authMiddleware.restrictTo('admin'), reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
