import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Category from '../models/Category.js';

const getCategories = asyncHandler(async (req, res, next) => { });

const getCategory = asyncHandler(async (req, res, next) => { });

const createCategory = asyncHandler(async (req, res, next) => { });

const updateCategory = asyncHandler(async (req, res, next) => { });

const deleteCategory = asyncHandler(async (req, res, next) => { });

const categoryController = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;
