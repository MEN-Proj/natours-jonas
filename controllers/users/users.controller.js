// Get all users
const { AppError } = require('../../utils/AppError');
const { StatusCodes } = require('../../utils/statusCodes');
const { successResponse } = require('../../utils/apiSuccessResponse');
const { User } = require('../../models/user/user.model');
const { deleteOne } = require('../factory-controllers/handlerFactory');

function filterObj(obj, fieldsToFilter) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fieldsToFilter.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
}

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  successResponse(res, users);
};

exports.updateMe = async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // 1) create error if user POSTs password data
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, ['name', 'email']);

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return successResponse(res, updateUser);
};

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  return successResponse(res, { msg: 'User deleted successfully' });
};

// Get user by id
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  successResponse(res, user);
};

// Create User
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Update User
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Delete User
exports.deleteUser = deleteOne(User);
