const httpStatus = require('http-status');
const { EmployerDetails } = require('../models/employerDetails.model');
const { PlanPayment } = require('../models/planPaymentDetails.model');
const { CreatePlan } = require('../models/createPlan.model');
const { EmployerRegistration } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');

//keySkill

const createEmpDetails = async (userId, userBody) => {
  let app = await EmployerRegistration.findOne({_id:userId, adminStatus:"Approved"})
  if(!app){
    throw new ApiError(httpStatus.NOT_FOUND, 'Employer Not Approved');
  }
  const {validity, interviewDate} = userBody;
  let date = moment().format('YYYY-MM-DD');
  let creat1 = moment().format('HHmmss');
  // console.log(validity);
  let expiredDate = moment().add(validity, 'days').format('YYYY-MM-DD');
  let values = { ...userBody, ...{ userId: userId, expiredDate: expiredDate, date: date, time:creat1, interviewstartDate:interviewDate.startDate, interviewendDate:interviewDate.endDate} };
  const freeCount = await EmployerDetails.find({userId:userId})
  const usser = await EmployerRegistration.findById(userId)
  console.log(freeCount.length, usser.freePlanCount)
  if(freeCount.length  >= usser.freePlanCount){
  const da = await PlanPayment.findOne({userId:userId, active:true})
  if(!da){
    throw new ApiError(httpStatus.NOT_FOUND, 'your not pay the plan');
  }
  if(date > da.expDate){
    await PlanPayment.findByIdAndUpdate({_id:da._id}, {active:false}, {new:true})
    throw new ApiError(httpStatus.NOT_FOUND, 'plan time expired');
  }
     const createPlan = await CreatePlan.findOne({_id:da.planId})
     if(da.countjobPost == createPlan.jobPost){
      await PlanPayment.findByIdAndUpdate({_id:da._id}, {active:false}, {new:true})
      throw new ApiError(httpStatus.NOT_FOUND, 'jobpost limit over...');
     }
    // }
    let count = da.countjobPost += 1
    await PlanPayment.findByIdAndUpdate({_id:da._id}, {countjobPost:count}, {new:true})
  }

  let data = await EmployerDetails.create(values);
  // if(freeCount == usser.freePlanCount){
  // }
  return data;
};

const createEmpDetailsRepost = async (id, userBody) => {
  const { validity } = userBody;

  let expiredDate = moment().add(validity, 'days').format('YYYY-MM-DD');
  let date = moment().format('YYYY-MM-DD');
  let creat1 = moment().format('HHmmss');
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
  }
  let values = { ...userBody, ...{ expiredDate: expiredDate, date: date, adminStatus: 'Pending', time:creat1} };
  console.log(values)
  const data = await EmployerDetails.findByIdAndUpdate({ _id: id }, values, { new: true });
  await data.save();
  return data;
};

const getByIdUser = async (id) => {
  let dates = moment().format('YYYY-MM-DD');
  const data = await EmployerDetails.aggregate([
    {
      $sort: { date: -1, time: -1 },
    },
    {
      $match: {
        $and: [{ userId: { $eq: id } }],
      },
    },

    {
      $project: {
        keySkill: 1,
        dates: dates,
        date: 1,
        active: 1,
        jobTittle: 1,
        designation: 1,
        recruiterName: 1,
        contactNumber: 1,
        jobDescription: 1,
        salaryRangeFrom: 1,
        salaryRangeTo: 1,
        experienceFrom: 1,
        experienceTo: 1,
        interviewType: 1,
        candidateDescription: 1,
        workplaceType: 1,
        industry: 1,
        interviewerName: 1,
        preferredindustry: 1,
        functionalArea: 1,
        role: 1,
        jobLocation: 1,
        employmentType: 1,
        openings: 1,
        interviewDate: 1,
        interviewTime: 1,
        location: 1,
        interviewerName: 1,
        interviewerContactNumber: 1,
        validity: 1,
        educationalQualification: 1,
        userId: 1,
        expiredDate: 1,
        createdAt: 1,
        adminStatus: 1,
        adminStatuss: {
          $cond: {
            if: { $gt: [dates, '$expiredDate'] },
            then: 'Expired',
            else: '$adminStatus',
          },
        },

        //  companyName:"$employerregistrations.companyName",
        //  email:"$employerregistrations.email",
        //  mobileNumber:"$employerregistrations.mobileNumber",
        //  companyType:"$employerregistrations.companyType",
        //  name:"$employerregistrations.name",
        //  regitserStatus:"$employerregistrations.adminStatus",
      },
    },
  ]);
  return data;
};

const getById = async (id) => {
  const data = await EmployerDetails.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
  }
  return data;
  
};

const data_Id = async (id) => {
  const data = await EmployerDetails.aggregate([
    {
      $match: {
        $and: [{ userId: { $eq: id } }],
      },
    },
  ]);
  return data;
};


const getById_Get = async (id) => {
  let dates = moment().format('YYYY-MM-DD');
  const data = await EmployerDetails.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $project: {
        keySkill: 1,
        date: 1,
        dates: dates,
        active: 1,
        jobTittle: 1,
        designation: 1,
        recruiterName: 1,
        contactNumber: 1,
        jobDescription: 1,
        salaryRangeFrom: 1,
        salaryRangeTo: 1,
        experienceFrom: 1,
        experienceTo: 1,
        interviewType: 1,
        candidateDescription: 1,
        workplaceType: 1,
        industry: 1,
        interviewerName: 1,
        preferredindustry: 1,
        functionalArea: 1,
        role: 1,
        jobLocation: 1,
        employmentType: 1,
        openings: 1,
        interviewDate: 1,
        interviewTime: 1,
        location: 1,
        interviewerName: 1,
        interviewerContactNumber: 1,
        validity: 1,
        educationalQualification: 1,
        userId: 1,
        expiredDate: 1,
        createdAt: 1,
        adminStatus: 1,
        adminStatuss: {
          $cond: {
            if: { $gt: [dates, '$expiredDate'] },
            then: 'Expired',
            else: '$adminStatus',
          },
        },

        //  companyName:"$employerregistrations.companyName",
        //  email:"$employerregistrations.email",
        //  mobileNumber:"$employerregistrations.mobileNumber",
        //  companyType:"$employerregistrations.companyType",
        //  name:"$employerregistrations.name",
        //  regitserStatus:"$employerregistrations.adminStatus",
      },
    },
  ]);
  return data;
};

const updateById = async (id, updateBody) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
  }
  const data = await EmployerDetails.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  await data.save();
  return data;
};

const deleteById = async (id) => {
  const user = await EmployerDetails.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
  }
  await user.remove();
  return user;
};


const countPostjobError = async (userId) =>{
  let date = moment().format('YYYY-MM-DD');
  let app = await EmployerRegistration.findOne({_id:userId, adminStatus:"Approved"})
  if(!app){
    throw new ApiError(httpStatus.NOT_FOUND, 'Employer Not Approved');
  }
  const freeCount = await EmployerDetails.find({userId:userId})
  const usser = await EmployerRegistration.findById(userId)
  const daaa = await PlanPayment.findOne({userId:userId, active:true})
  if(freeCount.length == usser.freePlanCount && !daaa){ 
    throw new ApiError(httpStatus.NOT_FOUND, 'your free post over..');
  }
   if(freeCount.length >= usser.freePlanCount){
   const da = await PlanPayment.findOne({userId:userId, active:true})
   if(!da){
    throw new ApiError(httpStatus.NOT_FOUND, 'your not pay the plan');
   }
   const createPlan = await CreatePlan.findOne({_id:da.planId})
   if(da.countjobPost == createPlan.jobPost){
    throw new ApiError(httpStatus.NOT_FOUND, 'jobpost limit over...');
   }
   if(date > da.expDate){
    await PlanPayment.findByIdAndUpdate({_id:da._id}, {active:false}, {new:true})
    throw new ApiError(httpStatus.NOT_FOUND, 'plan time expired');
  }
}
  return {message:"button enable"}
}

module.exports = {
  createEmpDetails,
  getByIdUser,
  deleteById,
  updateById,
  createEmpDetailsRepost,
  getById_Get,
  data_Id,
  countPostjobError,
};
