import slugify from 'slugify';
import mongoose from 'mongoose';

const { model, models, Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A product must have a name'],
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
}, {
  timestamps: true,
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

const Product = models.Product || model('Product', productSchema);

export default Product;
