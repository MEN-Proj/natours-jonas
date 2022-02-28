const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../../controllers/users/users.controller');
const {
  signUp,
  signIn,
  forgotPassword,
  resetToken,
  updateMyPassword,
} = require('../../controllers/users/auth.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', signIn);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetToken);

userRouter.patch('/updateMyPassword', authMiddleware, updateMyPassword);
userRouter.patch('/updateMe', authMiddleware, updateMe);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
