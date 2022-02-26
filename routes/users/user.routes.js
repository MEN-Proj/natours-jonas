const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../../controllers/users/users.controller');
const {
  signUp,
  signIn,
  forgotPassword,
  resetToken,
} = require('../../controllers/users/auth.controller');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', signIn);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword/:token', resetToken);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
