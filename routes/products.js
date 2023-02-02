import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import productController from '../controllers/productController.js';

const router = express.Router();

export default router;
