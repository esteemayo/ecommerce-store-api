/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/my-orders', orderController.getUserOrders);

router.get(
  '/income',
  authMiddleware.restrictTo('admin'),
  orderController.getMonthlyIncome
);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), orderController.getOrders)
  .post(authMiddleware.restrictTo('user'), orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(authMiddleware.restrictTo('admin'), orderController.updateOrder)
  .delete(authMiddleware.restrictTo('admin'), orderController.deleteOrder);

export default router;
