const httpStatus = require('http-status');
const { PlanPayment } = require('../models/planPaymentDetails.model');
const { CreatePlan } = require('../models/createPlan.model');
const { CandidateRegistration } = require('../models');
const { KeySkill } = require('../models/candidateDetails.model');
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
        countjobPost:1,
        cvAccess:'$createplans.cvAccess',
        cvCount:1,
        userId:1,
        // jobPostBalance:{ $subtract: ['$jobPost', '$postJobUsed'] },
      }
    }
  ])
  return data
}

const  cvCount = async (candidateId,userId) => {
   const data = await PlanPayment.findOne({userId:userId, active:true})
   if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, 'planPayment not found');
   }
   const data1 = await PlanPayment.findOne({userId:userId, active:true, cvCountUser:{$elemMatch:{$in:[candidateId]}}})
  //  console.log(data1, "efe")
   if(!data1){
    const dat = await PlanPayment.findOne({userId:userId, active:true})
    let counnt = dat.cvCount +=1
   return  await PlanPayment.findOneAndUpdate({userId:userId, active:true}, {cvCount:counnt, $push: { cvCountUser: candidateId }}, {new:true})
   }else{
    return {message:"cv already viewed..."}
   }
} 

const  cvdata = async (userId) => {
  let candidates = []
  const data = await PlanPayment.findOne({userId:userId, active:true})
  if(!data){
   throw new ApiError(httpStatus.NOT_FOUND, 'planPayment not found');
  }
  for(let i = 0; i < data.cvCountUser.length; i++){
      const value = await CandidateRegistration.findById(data.cvCountUser[i])
      candidates.push(value)
  }
  return candidates
}

const  cvdata_view = async (id) => {
  // console.log(id)
  const data = await KeySkill.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: id } }] 
    }
    },
  ])
  return data
}

module.exports = {
    createPlanPayment,
    Plan_Deactivate,
    employerPlanHistory,
    cvCount,
    cvdata,
    cvdata_view,
};