/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/my-orders', orderController.getUserOrder);

router.get(
  '/income',
  authMiddleware.restrictTo('admin'),
  orderController.getMonthlyIncome,
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
