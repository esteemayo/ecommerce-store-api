/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import APIFeatures from '../utils/apiFeatures.js';
import Category from '../models/category.model.js';
import NotFoundError from '../errors/notFound.js';

const getCategories = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query;

  res.status(StatusCodes.OK).json(categories);
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID ↔ ${categoryId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(category);
});

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(category);
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCategory) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID ↔ ${categoryId}`
      )
    );
  }

  res.status(StatusCodes.OK).json(updatedCategory);
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID ↔ ${categoryId}`
      )
    );
  }

  res.status(StatusCodes.NO_CONTENT).json(null);
});

const categoryController = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;
