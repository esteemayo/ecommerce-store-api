# E-commerce Application

A robust e-commerce application built using Express, Mongoose, JSON Web Tokens (JWT), MongoDB, BcryptJS, Nodemailer, Stripe and more.

## Table of Contents

1. #overview
2. #features
3. #technical-requirements
4. #setup-and-installation
5. #usage
6. #authentication-and-authorization
7. #database-schema
8. #api-endpoints
9. #payment-gateway
10. #email-notifications
11. #password-security
12. #contributing
13. #license

## Overview

This e-commerce application allows user to browse and purchase products, manage their accounts, and track their orders. The application uses Express as the backend framework, Mongoose for MongoDB interactions, JSON Web Tokens (JWT) for authentication and authorization, and Stripe for payment processing.

## Features

- User authentication and authorization using JSON Web Token (JWT)
- Product browsing and purchasing
- Order management and tracking
- User account management
- Payment processing using Stripe
- Email notifications using Nodemailer
- Password security using BcryptJS

## Technical Requirements

- Node.js (20.x)
- Express (4.x)
- Mongoose (6.x)
- JSON Web Tokens (9.x)
- MongoDB (4.x)
- BcryptJS (2.x)
- Nodemailer (6.x)
- Stripe (11.x)

## Setup and Installation

1. Clone the repository: <mark>[git clone](https://github.com/esteemayo/ecommerce-store-api.git)</mark>
2. Change into the project directory: <mark>cd your-repo-name</mark>
3. Install dependencies: <mark>npm install or yarn install</mark>
4. Create a <mark>config.env</mark> file and add the following environment variables:

- PORT: Application local port number
- NODE_ENV: Application enviroment
- DEV_URL: Client side development web address [http://localhost:5173](http://localhost:5173)
- PROD_URL: Client side production web address [https://estoress.netlify.app](https://estoress.netlify.app)
- <mark>DATABASE:</mark> MongoDB URI connection string
- <mark>DATABASE_PASSWORD:</mark> MongoDB URI password string
- <mark>DATABASE_LOCAL:</mark> MongoDB local connection string
- <mark>JWT_SECRET:</mark> JSON Web Token secret key
- <mark>JWT_EXPIRES_IN:</mark> JSON Web Token expires key
- <mark>JWT_COOKIE_EXPIRES_IN:</mark> JSON Web Token cookie expires key
- <mark>MAIL_HOST:</mark> Nodemailer smtp host key
- <mark>MAIL_PORT:</mark> Nodemailer smtp port key
- <mark>MAIL_USERNAME:</mark> Nodemailer smtp auth username key
- <mark>MAIL_PASSWORD:</mark> Nodemailer smtp auth password key
- <mark>MAIL_FROM:</mark> Nodemailer mail option key
- <mark>STRIPE_SECRET_KEY:</mark> Stripe secret key

5. Start the application: <mark>npm run dev</mark> or <mark>yarn dev</mark>

## Usage

1. Open a web browser or postman and navigate to [http://localhost:2020](http://localhost:2020)
2. Open [login route](http://localhost:2020/api/v1/auth/login) to authenticate using JSON Web Tokens (JWT)

## Authentication and Authorization

This application uses JSON Web Tokens (JWT) for authentication and authorization. Users can login using their username and password, and return the user's data with the authentication token, and the token is also stored in the cookie after successful authentication. The <mark>JWT_SECRET</mark> environment variable is used to secure the authentication process.

## Database Schema

The database schema is defined using Mongoose. The schema includes the following models:

- <mark>User:</mark> Represents a user with a name, email, username, password, confirmPassword, phone, country, role, active, fromFacebook, fromGoogle, image, passwordChangedAt, resetPasswordToken, and resetPasswordExpires.
- <mark>Product:</mark> Represents a product with a name, desc, slug, price, priceDiscount, numberInStock, inStock, images, featured, color, size, likes, category, properties, tags, ratingsQuantity, ratingsAverage, and views.
- <mark>Order:</mark> Represents an order with a customer, address, products, total, status, paymentMethod, and user.
- <mark>Cart:</mark> Represents a cart with a quantity, user, and product.
- <mark>Category:</mark> Represents a category with a name, parent, and properties.
- <mark>Review:</mark> Represents a review with a review, rating, terms, product, and a user.

## API Endpoints

The following API endpoints are available:

### Authentication Endpoints

- <mark>POST /api/v1/auth/login:</mark> Authenticates a user and returns a JSON Web Token (JWT).
- <mark>POST /api/v1/auth/facebook-login:</mark> Authenticates a user and returns a JSON Web Token (JWT).
- <mark>POST /api/v1/auth/google-login:</mark> Authenticates a user and returns a JSON Web Token (JWT).
- <mark>POST /api/v1/auth/register:</mark> Creates a new user and returns user data and JWT.
- <mark>POST /api/v1/auth/logout:</mark> Clears authenticated user's token from the cookie.
- <mark>POST /api/v1/auth/forgot-password:</mark> Sends a request to reset a user's password through email.
- <mark>POST /api/v1/auth/reset-password/:token:</mark> Reset a user password.
- <mark>PATCH /api/v1/auth/update-my-password:</mark> Updates authenticated user's password.

### User Endpoints

- <mark>GET /api/v1/users:</mark> Returns the users data, authorized by the admin.
- <mark>GET /api/v1/users/:id:</mark> Returns a single user by ID.
- <mark>GET /api/v1/users/me:</mark> Returns authenticated user data.
- <mark>GET /api/v1/users/stats:</mark> Returns number of registered users in each month of the year.
- <mark>POST /api/v1/users:</mark> Cannot be used to create a new user.
- <mark>PATCH /api/v1/users/:id:</mark> Updates a single user data, authorized by the admin.
- <mark>PATCH /api/v1/users/update-me:</mark> Updates the authenticated user's data such as name, email, username, image, etc. But cannot update authenticated user's password.
- <mark>PATCH /api/v1/users/update-email:</mark> Updates authenticated user's email address.
- <mark>DELETE /api/v1/users/:id:</mark> Deletes a single user by ID, authorized by the admin.
- <mark>DELETE /api/v1/users/delete-me:</mark> Deletes authenticated user's data, authorized by both authenticated user and admin.

### Product Endpoints

- <mark>GET /api/v1/products:</mark> Returns a list of products.
- <mark>GET /api/v1/products/stats:</mark> Returns the products statistics by the ratings average.
- <mark>GET /api/v1/products/tags:</mark> Returns a list of products with one or more related or common tags.
- <mark>GET /api/v1/products/:id:</mark> Returns a single product by ID.
- <mark>GET /api/v1/products/count-by-category:</mark> Returns total number of products in a category.
- <mark>GET /api/v1/products/search:</mark> Returns a list of products by the product's name search query.
- <mark>GET /api/v1/products/details/:slug:</mark> Returns a single product by SLUG.
- <mark>POST /api/v1/products:</mark> Create a new product.
- <mark>PATCH /api/v1/products/:id:</mark> Updates a product by ID.
- <mark>PATCH /api/v1/products/like/:id:</mark> Handles the likes functionality of a product.
- <mark>PATCH /api/v1/products/views/:id:</mark> Increment the number of views on a product.
- <mark>DELETE /api/v1/products/:id:</mark> Deletes a product by ID.

### Order Endpoints

- <mark>GET /api/v1/orders:</mark> Returns a list of orders for the authenticated admin.
- <mark>GET /api/v1/orders/my-orders:</mark> Returns a list of orders for the authenticated user.
- <mark>GET /api/v1/orders/income:</mark> Returns the monthly income generated from a list of orders.
- <mark>GET /api/v1/orders/:id:</mark> Returns a single order by ID.
- <mark>POST /api/v1/orders:</mark> Creates a new order for the authenticated user.
- <mark>PATCH /api/v1/orders/:id:</mark> Updates an order by ID for the authenticated admin.
- <mark>DELETE /api/v1/orders/:id:</mark> Deletes an order by ID for the authenticated admin

### Cart Endpoints

- <mark>GET /api/v1/carts:</mark> Returns a list of cart items.
- <mark>GET /api/v1/carts/:id:</mark> Returns a single cart item by ID.
- <mark>POST /api/v1/carts:</mark> Create a new cart item.
- <mark>PATCH /api/v1/carts/:id:</mark> Updates a cart item by ID.
- <mark>DELETE /api/v1/carts/:id:</mark> Deletes a cart item by ID.

### Category Endpoints

- <mark>GET /api/v1/categories:</mark> Returns a list of categories for the authenticated admin.
- <mark>GET /api/v1/categories/:id:</mark> Returns a single category by ID for the authenticated admin.
- <mark>POST /api/v1/categories:</mark> Create a new category for the authenticated admin.
- <mark>PATCH /api/v1/categories/:id:</mark> Updates a category by ID for the authenticated admin.
- <mark>DELETE /api/v1/categories/:id:</mark> Deletes a category by ID for the authenticated admin.

### Review Endpoints

- <mark>GET /api/v1/reviews:</mark> Returns a list of reviews.
- <mark>GET /api/v1/reviews/top:</mark> Returns a list of reviews where rating is greater or equals to <mark>4.5</mark>.
- <mark>GET /api/v1/reviews/total-reviews/:id:</mark> Returns the total number of ratings on a product.
- <mark>GET /api/v1/reviews/:id:</mark> Returns a single review by ID for the authenticated user.
- <mark>POST /api/v1/reviews:</mark> Creates a new review for the authenticated user.
- <mark>PATCH /api/v1/reviews/:id:</mark> Updates a review by ID for the authenticated user or admin.
- <mark>DELETE /api/v1/reviews/:id:</mark> Deletes a review by ID for the authenticated user or admin.

### Checkout Endpoints

- POST /api/v1/checkout: Creates a charge on a customer's payment method.

## Payment Gateway

This application uses Stripe for payment processing. The STRIPE_SECRET_KEY environment variable is used to secure the payment process.
