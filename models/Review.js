import mongoose, { Schema, Types } from 'mongoose';

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

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name image',
  });

  next();
});

const Review = mongoose.models.Review ||
  mongoose.model('Review', reviewSchema);

export default Review;
