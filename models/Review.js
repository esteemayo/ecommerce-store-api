import mongoose from 'mongoose';

const { model, models, Types, Schema } = mongoose;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Rating must not be below 1.0'],
      max: [5, 'Rating must not be above 5.0'],
      required: [true, 'A review must have a rating'],
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const Review = models.Review || model('Review', reviewSchema);

export default Review;
