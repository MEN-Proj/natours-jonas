const { User } = require('../../models/tour/user.model');
const { successResponse } = require('../../utils/apiSuccessResponse');

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // createSendToken(newUser, 201, res);
  successResponse(res, newUser, 201);
};
