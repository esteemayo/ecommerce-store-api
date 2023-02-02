/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

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
