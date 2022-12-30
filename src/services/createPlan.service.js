const httpStatus = require('http-status');
const { CreatePlan } = require('../models/createPlan.model');
const { PlanPayment } = require('../models/planPaymentDetails.model');
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
        active:'$createplans.active',
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

const get_All_plans = async (id) => {
  const data = await CreatePlan.aggregate([
    {
      $lookup: {
        from: 'planpayments',
        localField: '_id',
        foreignField: 'planId',
        pipeline:[    { 
          $match: { 
            $and: [ { userId: { $eq: id } }] 
        }
        },],
        as: 'planpayments',
      },
    },
    {
      $unwind: {
        path: '$planpayments',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project:{
        active:1,
        planName:1,
        jobPost:1,
        cvAccess:1,
        numberOfMassMailer:1,
        cost:1,
        offer:1,
        validityOfPlan:1,
        jobPostVAlidity:1,
        userId:1,
        date:1,
        time:1,
        planPaymentDate:"$planpayments.date",
        paymentStatus:{ $ifNull: ['$planpayments.paymentStatus', "Pending"]},
      }
    },
    {
      $sort:{date:-1, time:-1}
    },
  ])
  return data
}

const AdminSide_after_Employee_Payment = async () => {
  const data = await PlanPayment.aggregate([
    {
      $lookup: {
        from: 'employerregistrations',
        localField: 'userId',
        foreignField: '_id',
        as: 'employerregistrations',
      },
    },  
    {
      $unwind:'$employerregistrations',
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
      $project:{
         cashType:1,
         paymentStatus:1,
         payAmount:1,
         mobileNumber:"$employerregistrations.mobileNumber",
         pincode:"$employerregistrations.pincode",
         email:"$employerregistrations.email",
         name:"$employerregistrations.name",
         companyName:"$employerregistrations.companyName",
         companyType:"$employerregistrations.companyType",
         planName:"$createplans.planName",
         cost:"$createplans.cost",
         jobPost:'$createplans.jobPost',
         cvAccess:'$createplans.cvAccess',
         numberOfMassMailer:'$createplans.numberOfMassMailer',
         offer:'$createplans.offer',
         validityOfPlan:'$createplans.validityOfPlan',
         jobPostVAlidity:'$createplans.jobPostVAlidity',
         date:1,
         active:1,

      }
    }
  ])
  return data ;
}

module.exports = {
    createPlan,
    plan_view,
    updateById,
    get_All_plans,
    AdminSide_after_Employee_Payment,
};
