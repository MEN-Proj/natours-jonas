const { AppError } = require('../../utils/AppError');
const { StatusCodes } = require('../../utils/statusCodes');
const { successResponse } = require('../../utils/apiSuccessResponse');

exports.createOne = (Model) => async (req, res, next) => {
  const newDoc = await Model.create(req.body);

  return successResponse(res, newDoc, StatusCodes.CREATED);
};

exports.deleteOne = (Model) => async (req, res, next) => {
  const id = req?.params?.id;

  const doc = await Model.findByIdAndDelete(id);

  if (!doc) {
    return next(
      new AppError(`No doc found with id ${id}`, StatusCodes.NOT_FOUND),
    );
  }

  return successResponse(res, { msg: 'Document deleted successfully' });
};

exports.updateOne = (Model) => async (req, res, next) => {
  const id = req?.params?.id;

  const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedDoc) {
    return next(
      new AppError(`No doc found with id ${id}`, StatusCodes.NOT_FOUND),
    );
  }

  return successResponse(res, updatedDoc);
};
