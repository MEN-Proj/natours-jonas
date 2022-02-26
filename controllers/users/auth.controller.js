const jwt = require('jsonwebtoken');
const { User } = require('../../models/user/user.model');
const { successResponse } = require('../../utils/apiSuccessResponse');
const { AppError } = require('../../utils/AppError');
const { StatusCodes } = require('../../utils/statusCodes');
const { token } = require('morgan');
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

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  newUser.password = undefined;
  newUser.__v = undefined;

  // createSendToken(newUser, 201, res);
  successResponse(res, { newUser, token }, 201);
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

  const token = signToken(user._id);

  // 3) If everything ok, send token to client
  user.password = undefined;
  successResponse(res, { user, token });
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

exports.resetToken = async (req, res, next) => {};
