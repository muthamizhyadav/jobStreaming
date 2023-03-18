const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const createDummyService = require('../services/DummyDetails.service');

const createDummy = catchAsync(async (req, res) => {
  const data = await createDummyService.createDummy(req.body);
  res.send(data);
});

// createDummy

module.exports = {
  createDummy,
};
