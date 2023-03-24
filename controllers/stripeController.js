import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const payment = asyncHandler(async (req, res, next) => {
  const stripeRes = await stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: 'usd',
  }, {
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  res.status(StatusCodes.OK).json(stripeRes);
});

const stripeController = {
  payment,
};

export default stripeController;
