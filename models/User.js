import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address',
    ],
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter your username'],
    match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    maxlength: 1024,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    maxlength: 1024,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role is either: user or admin',
    },
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
  },
  fromGoogle: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.comparePassword = async function (candidatePasssword) {
  return await bcrypt.compare(candidatePasssword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
