/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router
  .route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
