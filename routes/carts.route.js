/* eslint-disable */
import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as cartController from '../controllers/cart.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(cartController.getCarts).post(cartController.createCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
