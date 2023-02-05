import mongoose, { Schema, Types } from 'mongoose';

const { model, models } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
      type: String,
      required: [true, 'An order must belong to a customer'],
      maxLength: [60, 'An order customer\'s name must have less or equal than 60 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please enter your address'],
      maxLength: [200, 'Please address must have less or equal than 200 characters'],
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
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'An order must belong to a user'],
    }
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model('Order', orderSchema);

export default Order;
