/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import reviewRouter from './reviews.route.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router.get(
  '/stats',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  productController.getProductStats
);

router.get('/tags', productController.getProductByTags);

router.get('/count-by-category', productController.getCountByCategory);

router.get('/search', productController.searchProducts);

router.get('/details/:slug', productController.getProductBySlug);

router.patch(
  '/like/:id',
  authMiddleware.protect,
  productController.likeProduct
);

router.patch('/views/:id', productController.updateViews);

router
  .route('/')
  .get(productController.getProducts)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.deleteProduct
  );

export default router;
