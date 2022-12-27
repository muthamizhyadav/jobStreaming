const httpStatus = require('http-status');
const { CreatePlan } = require('../models/createPlan.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');


const createPlan = async (userId, userBody) => {
  const { validityOfPlan, jobPostVAlidity} = userBody;
  let date = moment().format('YYYY-MM-DD');
  let creat1 = moment().format('HHmmss');
  let validityOfPlanExpiry = moment().add(validityOfPlan, 'days').format('YYYY-MM-DD');
  let jobPostVAlidityExpiry = moment().add(jobPostVAlidity, 'days').format('YYYY-MM-DD');
  let values = { ...userBody, ...{ userId: userId, validityOfPlanExpiry: validityOfPlanExpiry, jobPostVAlidityExpiry:jobPostVAlidityExpiry, date: date, time:creat1} };
  let data = await CreatePlan.create(values);
  return data;
};


module.exports = {
    createPlan,
};
