/* eslint-disable  */
import mongoose from 'mongoose';
import Product from './Product.js';

const { Schema, Types } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must not be below 1.0'],
      max: [5, 'Rating must not be above 5.0'],
      required: [true, 'A review must have a rating'],
    },
    terms: {
      type: Boolean,
      default: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name image',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, function (next) {
  this.r = this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (doc, next) {
  await doc.constructor.calcAverageRatings(this.r.product);
  next();
});

reviewSchema.statics.getTopReviews = async function () {
  const reviews = await this.aggregate([
    {
      $match: {
        rating: { $gt: 4.5 },
      },
    },
    {
      $sample: { size: 10 },
    },
  ]);

  return reviews;
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
