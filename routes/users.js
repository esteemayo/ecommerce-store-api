import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
