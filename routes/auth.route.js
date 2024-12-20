/* eslint-disable */

import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/facebook-login', authController.facebookLogin);

router.post('/google-login', authController.googleLogin);

router.post('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authMiddleware.protect,
  authController.updatePasword
);

export default router;
