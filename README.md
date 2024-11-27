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
4. Create a <mark>.env</mark> file and add the following environment variables:

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
