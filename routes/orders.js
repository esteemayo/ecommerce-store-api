/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router
  .route(orderController.getOrders)

export default router;
