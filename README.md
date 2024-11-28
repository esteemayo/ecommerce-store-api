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

- GET /api/v1/users: Returns the users data, authorized by only the admin.
- GET /api/v1/users/:id: Returns a single user by ID.
- GET /api/v1/users/me:: Returns authenticated user data.
- GET /api/v1/users/stats: Returns number of registered users in each month of the year.
- POST /api/v1/users: Cannot be used to create a new user.
- PATCH /api/v1/users/:id: Updates a single user data, authorized by the admin only.
- PATCH /api/v1/users/update-me: Updates the authenticated user's data such as name, email, username, image, etc. But cannot update authenticated user's password.
- PATCH /api/v1/users/update-email: Updates authenticated user's email address.
- DELETE /api/v1/users/:id: Deletes a single user by ID, authorized by the admin only.
- DELETE /api/v1/users/delete-me: Deletes authenticated user's data, authorized by both authenticated user and admin.
