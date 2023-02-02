/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Category from '../models/Category.js';
import NotFoundError from '../errors/notFound.js';

const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.status(StatusCodes.OK).json(categories);
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(
      new NotFoundError(`There is no category found with the given ID ↔ ${categoryId}`)
    );
  }

  res.status(StatusCodes.OK).json(category);
});

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(category);
});

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
