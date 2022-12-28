const httpStatus = require('http-status');
const { CreatePlan } = require('../models/createPlan.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');
const { User } = require('../models');

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

const plan_view = async (id) => {
  const data = await User.aggregate([
    { 
      $match: { 
        $and: [ { _id: { $eq: id } }] 
    }
    },
    {
      $lookup: {
        from: 'createplans',
        localField: '_id',
        foreignField: 'userId',
        as: 'createplans',
      },
    },
    {
      $unwind:'$createplans',
    },
    {
      $project:{
        name:1,
        email:1,
        planName:'$createplans.planName',
        jobPost:'$createplans.jobPost',
        cvAccess:'$createplans.cvAccess',
        numberOfMassMailer:'$createplans.numberOfMassMailer',
        cost:'$createplans.cost',
        offer:'$createplans.offer',
        validityOfPlan:'$createplans.validityOfPlan',
        jobPostVAlidity:'$createplans.jobPostVAlidity',
        // validityOfPlanExpiry:'$createplans.validityOfPlanExpiry',
        // jobPostVAlidityExpiry:'$createplans.jobPostVAlidityExpiry',
        date:'$createplans.date',
        time:'$createplans.time',
        createdAt:'$createplans.createdAt',
        planId:'$createplans._id',
      }
    },
    {
      $sort: {date:-1, time:-1}
    },
  ])
  return data
}

const updateById = async (id, updateBody) => {
  const user = await CreatePlan.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'createPlan not found');
  }
  const data = await CreatePlan.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  await data.save();
  return data;
};


module.exports = {
    createPlan,
    plan_view,
    updateById,
};
