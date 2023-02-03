/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
