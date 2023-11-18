/* eslint-disable */
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';

const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(StatusCodes.OK).json(docs);
  });

const getOneById = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    let query = Model.findById(docId);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID ↔ ${docId}`
        )
      );
    }

    res.status(StatusCodes.OK).json(doc);
  });

const getOneBySlug = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    let query = Model.findOne({ slug });
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given SLUG ↔ ${slug}`
        )
      );
    }

    res.status(StatusCodes.OK).json(doc);
  });

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json(doc);
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const updatedDoc = await Model.findByIdAndUpdate(
      docId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateddoc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID ↔ ${docId}`
        )
      );
    }

    res.status(StatusCodes.OK).json(updatedDoc);
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findByIdAndDelete(docId);

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID ↔ ${docId}`
        )
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      doc: null,
    });
  });

const factory = {
  getAll,
  getOneById,
  getOneBySlug,
  createOne,
  updateOne,
  deleteOne,
};

export default factory;
