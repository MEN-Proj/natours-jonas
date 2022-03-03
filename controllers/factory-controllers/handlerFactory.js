const { AppError } = require('../../utils/AppError');
const { StatusCodes } = require('../../utils/statusCodes');
const { successResponse } = require('../../utils/apiSuccessResponse');
const { APIFeatures } = require('../../utils/APIFeatures');

exports.createOne = (Model) => async (req, res, next) => {
  const newDoc = await Model.create(req.body);

  return successResponse(res, newDoc, StatusCodes.CREATED);
};

exports.getAll = (Model) => async (req, res, next) => {
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // execute query
  const docs = await features.query.exec();
  // response
  return successResponse(res, docs);
};

exports.getOne =
  (Model, populateOptions = null) =>
  async (req, res, next) => {
    const id = req?.params?.id;
    let query = Model.findById(id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query.exec();

    if (!doc) {
      return next(
        new AppError(`No document found with id ${id}`, StatusCodes.NOT_FOUND),
      );
    }

    successResponse(res, doc);
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
