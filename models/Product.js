import slugify from 'slugify';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A product must have a name'],
      maxlength: [
        30,
        'A product title must have less or equal than 30 characters',
      ],
      minlength: [
        3,
        'A product title must have more or equal than 3 characters',
      ],
    },
    desc: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description'],
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than regular price',
      },
    },
    numberInStock: {
      type: Number,
      required: [true, 'A product must have numberInstock'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    color: {
      type: [String],
      default: [],
    },
    size: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'A product must belong to a category'],
    },
    properties: {
      type: Object,
    },
    tags: {
      type: Array,
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'A product must have at least one tag',
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: 1 });
productSchema.index({ slug: -1 });

productSchema.virtual('discount').get(function () {
  return this.price * (this.priceDiscount / 100);
});

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre('save', function (next) {
  this.price -= this.discount;
  next();
});

productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const productWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (productWithSlug.length) {
    this.slug = `${this.slug}-${productWithSlug.length + 1}`;
  }
});

productSchema.statics.getProductStats = async function () {
  const stats = await this.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$category',
        numProducts: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  return stats;
};

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
