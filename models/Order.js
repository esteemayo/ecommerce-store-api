import mongoose from 'mongoose';

const { model, models, Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
      type: String,
      required: [true, 'An order must belong to a customer'],
    },
    address: {
      type: String,
      required: [true, 'Please enter your address'],
    },
    total: {
      type: Number,
      required: [true, 'An order must have a total amount'],
    },
    status: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model('Order', orderSchema);

export default Order;
