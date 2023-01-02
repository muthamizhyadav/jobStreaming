const httpStatus = require('http-status');
const { PlanPayment } = require('../models/planPaymentDetails.model');
const { CreatePlan } = require('../models/createPlan.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');
const { User } = require('../models');

const createPlanPayment = async (userId, userBody) => {
  const {planId} = userBody
  let date = moment().format('YYYY-MM-DD');
  let creat1 = moment().format('HHmmss');
  let ss = await CreatePlan.findOne({_id:planId})
  // validityOfPlan
  let jobPostVAlidityExpiry = moment().add(ss.validityOfPlan, 'days').format('YYYY-MM-DD');
  let values = { ...userBody, ...{ userId: userId, date: date, time:creat1, expDate:jobPostVAlidityExpiry} };
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
        expDate:1,
        planName:'$createplans.planName',
        jobPost:'$createplans.jobPost',
        cvAccess:'$createplans.cvAccess',
        numberOfMassMailer:'$createplans.numberOfMassMailer',
        cost:'$createplans.cost',
        offer:'$createplans.offer',
        validityOfPlan:'$createplans.validityOfPlan',
        jobPostVAlidity:'$createplans.jobPostVAlidity',
        postJobUsed:{ $ifNull: ['$employerdetails.count', 0] },
        userId:1,
        // jobPostBalance:{ $subtract: ['$jobPost', '$postJobUsed'] },
      }
    }
  ])
  return data
}

// const  cvCount = async (candidateId,userId) => {
//    const data = await PlanPayment.findOne({userId:userId, active:true})
//    if(!data){
//     throw new ApiError(httpStatus.NOT_FOUND, 'planPayment not found');
//    }
//    data.cvCountUser.forEach(async (e) => {
//          if(e != candidateId){
//           data.cvCountCandidate.push(candidateId)
//           await PlanPayment.findOneAndUpdate({userId:userId, active:true}, {})
//          }
//    });
// } 

module.exports = {
    createPlanPayment,
    Plan_Deactivate,
    employerPlanHistory,
};