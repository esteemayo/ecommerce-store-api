import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
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
      // required: [true, 'Please provide your password'],
      minlength: 8,
      maxlength: 1024,
      select: false,
    },
    confirmPassword: {
      type: String,
      // required: [true, 'Please confirm your password'],
      minlength: 8,
      maxlength: 1024,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    phone: {
      type: String,
      // required: [true, 'Please tell us your telephone number'],
    },
    country: {
      type: String,
      // required: [true, 'Please tell us your country'],
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
    fromFacebook: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.statics.getUserStats = async function () {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return stats;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
