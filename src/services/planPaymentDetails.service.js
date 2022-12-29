const httpStatus = require('http-status');
const { PlanPayment } = require('../models/planPaymentDetails.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');
const { User } = require('../models');

const createPlanPayment = async (userId, userBody) => {
  let date = moment().format('YYYY-MM-DD');
  let creat1 = moment().format('HHmmss');
  let values = { ...userBody, ...{ userId: userId, date: date, time:creat1} };
  let data = await PlanPayment.create(values);
  return data;
};


module.exports = {
    createPlanPayment,
};