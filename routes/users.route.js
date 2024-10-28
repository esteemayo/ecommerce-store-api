/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/me',
  authMiddleware.protect,
  userController.getMe,
  userController.getUser
);

router.get(
  '/stats',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.getUserStats
);

router.patch('/update-me', authMiddleware.protect, userController.updateMe);

router.patch(
  '/update-email',
  authMiddleware.protect,
  userController.updateEmail
);

router.delete('/delete-me', authMiddleware.protect, userController.deleteMe);

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    userController.getUsers
  )
  .post(authMiddleware.protect, userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    userController.deleteUser
  );

export default router;
