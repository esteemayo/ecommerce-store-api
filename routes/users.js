/* eslint-disable */
import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get(
  '/me',
  userController.getMe,
  userController.getUser,
);

router.get(
  '/stats',
  authMiddleware.restrictTo('admin'),
  userController.getUserStats,
);

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(authMiddleware.verifyUser, userController.getUser)
  .patch(authMiddleware.restrictTo('admin'), userController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

export default router;
