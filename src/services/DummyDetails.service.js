const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const Dummy = require('../models/DummyDetails.model');

const createDummy = async (body) => {
  let values = await Dummy.create(body);
  return values;
};

module.exports = {
  createDummy,
};
