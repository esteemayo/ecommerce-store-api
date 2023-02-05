import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'A category must have a name'],
      maxlength: [20, 'A category title must have less or equal than 20 characters'],
      minlength: [4, 'A category title must have more or equal than 5 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.models.Category ||
  mongoose.model('Category', categorySchema);

export default Category;
