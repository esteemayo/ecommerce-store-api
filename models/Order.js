import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
      type: String,
      required: [true, 'An order must belong to a customer'],
      maxLength: [
        60,
        "An order customer's name must have less or equal than 60 characters",
      ],
    },
    address: {
      type: String,
      required: [true, 'Please enter your address'],
      maxLength: [
        200,
        'Please address must have less or equal than 200 characters',
      ],
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
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.statics.getMonthlyIncome = async function () {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(date.setMonth(lastMonth.getTime() - 1));

  const income = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: prevMonth },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        sales: '$total',
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: '$sales' },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return income;
};

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
