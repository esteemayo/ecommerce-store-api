/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as stripeController from '../controllers/stripe.controller.js';

const router = express.Router();

router.post('/payment', authMiddleware.protect, stripeController.payment);

export default router;
