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

const Product = models.Product || model('Product', productSchema);

export default Product;
