/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import cartController from '../controllers/cartController.js';

const router = express.Router();

router
  .route('/')
  .get(cartController.getCarts)
  .post(cartController.createCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
