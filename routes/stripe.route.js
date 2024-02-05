/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import stripeController from '../controllers/stripe.controller.js';

const router = express.Router();

router.post('/payment', authMiddleware.protect, stripeController.payment);

export default router;
