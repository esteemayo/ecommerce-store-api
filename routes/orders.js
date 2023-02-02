/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router
  .route('/')
  .get(orderController.getOrders)

router
  .route('/:id')
  .get(orderController.getOrder)

export default router;
