/* eslint-disable */
import express from 'express';

import reviewRouter from './reviews.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import productController from '../controllers/productController.js';

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router.get('/tags', productController.getProductByTags);

router.get('/search', productController.searchProducts);

router.get('/details/:slug', productController.getProductBySlug);

router
  .route('/')
  .get(productController.getProducts)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.createProduct,
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.updateProduct,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.deleteProduct,
  );

export default router;
