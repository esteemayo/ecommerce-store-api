/* eslint-disable */
import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/google-login', authController.googleLogin);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authMiddleware.protect,
  authController.updatePasword
);

export default router;
