const { StatusCodes } = require('http-status-codes');
exports.successResponse = (res, data, statusCode = null) => {
  let status = { status: 'success' };

  if (Array.isArray(data)) {
    status = { ...status, results: data.length };
  }

  return res.status(statusCode ? statusCode : StatusCodes.OK).json({
    ...status,
    data,
  });
};
