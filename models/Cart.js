import mongoose from 'mongoose';

const { model, models, Types, Schema } = mongoose;

const cartSchema = new Schema(
  {
    quantity: {
      type: Number,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'A cart must belong to a user'],
    },
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: [true, 'A cart item must belong to a product'],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = models.Cart || model('Cart', cartSchema);

export default Cart;
