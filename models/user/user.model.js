const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password is changed
  if (!this.isModified('password')) {
    return next();
  }

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function (next) {
  // if password is not modified or document is newly created then skip this middleware
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // here this points to current query
  this.find({ active: { $eq: true } }).select('-__v');
  next();
});

userSchema.method({
  isPasswordCorrect: async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  },

  changedPasswordAfter: function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10,
      );

      return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
  },

  createPasswordResetToken: function () {
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash token and set to resetPasswordToken field
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    console.log(
      { resetToken },
      { passwordResetToken: this.passwordResetToken },
    );

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  },
});

exports.User = mongoose.model('User', userSchema);

// module.exports = User;
