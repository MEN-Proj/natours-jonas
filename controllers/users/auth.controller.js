const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../../models/user/user.model');
const { successResponse } = require('../../utils/apiSuccessResponse');
const { AppError } = require('../../utils/AppError');
const { StatusCodes } = require('../../utils/statusCodes');
const { sendEmail } = require('../../utils/sendEmailConfig');

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

const createSendToken = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  user.password = undefined;
  user.__v = undefined;

  // createSendToken(newUser, 201, res);
  successResponse(res, { user, token }, statusCode);
};

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  return createSendToken(res, newUser, StatusCodes.CREATED);
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req?.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  // 1) Check if email and password exist
  const user = await User.findOne({ email }).select('+password -__v');

  // 2) Check if user exists && password is correct
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(
      new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED),
    );
  }

  return createSendToken(res, user);
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        'There is no user with email address.',
        StatusCodes.NOT_FOUND,
      ),
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    successResponse(res, { message: 'Token sent to email!' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.resetToken = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(
      new AppError('Token is invalid or has expired', StatusCodes.BAD_REQUEST),
    );
  }

  const { password, passwordConfirm } = req.body;

  if (!passwordConfirm || !password) {
    return next(
      new AppError(
        'Please provide password and confirmPassword',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  return createSendToken(res, user);
};

exports.updateMyPassword = async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req?.body;
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (
    !user ||
    !(await user.isPasswordCorrect(currentPassword, user.password))
  ) {
    return next(
      new AppError('Your current password is wrong.', StatusCodes.UNAUTHORIZED),
    );
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  return createSendToken(res, user);
};
