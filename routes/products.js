/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import productController from '../controllers/productController.js';

const router = express.Router();

router.get('/details', productController.getProductBySlug);

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
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
