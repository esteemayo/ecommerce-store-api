/* eslint-disable */
import express from 'express';

import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/google-login', authController.googleLogin);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

export default router;
