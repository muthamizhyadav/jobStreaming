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

const Plan_Deactivate = async (id, body) => {
  const user = await PlanPayment.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'planPayment not found');
  }
  const data = await PlanPayment.findByIdAndUpdate({ _id: id }, body, { new: true });
  await data.save();
  return data;
};

const employerPlanHistory = async (id) => {
  const data = await PlanPayment.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: id } }] 
    }
    },
    {
      $lookup: {
        from: 'createplans',
        localField: 'planId',
        foreignField: '_id',
        as: 'createplans',
      },
    },
    {
      $unwind:'$createplans',
    },
    {
      $lookup: {
        from: 'employerdetails',
        localField: 'userId',
        foreignField: 'userId',
        pipeline:[
          {
            $group: { _id: null, count: { $sum: 1 }, },
          },
        ],
        as: 'employerdetails',
      },
    }, 
    {
      $unwind: {
        path: '$employerdetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project:{
        date:1,
        planName:'$createplans.planName',
        jobPost:'$createplans.jobPost',
        cvAccess:'$createplans.cvAccess',
        numberOfMassMailer:'$createplans.numberOfMassMailer',
        cost:'$createplans.cost',
        offer:'$createplans.offer',
        validityOfPlan:'$createplans.validityOfPlan',
        jobPostVAlidity:'$createplans.jobPostVAlidity',
        postJobUsed:'$employerdetails.count',
        // jobPostBalance:{ $subtract: ['$jobPost', '$postJobUsed'] },
      }
    }
  ])
  return data
}

module.exports = {
    createPlanPayment,
    Plan_Deactivate,
    employerPlanHistory,
};