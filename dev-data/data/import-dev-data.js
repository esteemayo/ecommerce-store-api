/* eslint-disable */
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import 'colors';

import Review from '../../models/Review.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import Category from '../../models/Category.js';

import connectDB from '../../config/db.config.js';

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8')
);
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const loadData = async () => {
  try {
    await Product.create(products);
    await User.create(users);
    await Category.create(categories);
    await Order.create(orders);
    await Review.create(reviews);
    console.log(
      '👍👍👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍👍👍'.green.bold
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const removeData = async () => {
  try {
    console.log('😢😢 Goodbye Data...');
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
        .blue.bold
    );
    process.exit();
  } catch (err) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold
    );
    console.log(err);
    process.exit();
  }
};

if (process.argv.includes('--load')) {
  loadData();
} else {
  removeData();
}
