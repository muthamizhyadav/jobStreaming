const httpStatus = require('http-status');
const { EmployerDetails } = require('../models/employerDetails.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { format } = require('morgan');

//keySkill

const createEmpDetails = async (userId, userBody) => {
  const {validity} = userBody
  console.log(validity)
    let expiredDate = moment().add(validity,'days').format('YYYY-MM-DD');
    let values = {...userBody, ...{userId:userId, expiredDate:expiredDate}}
 let data = await EmployerDetails.create(values);
 return data
};

const getByIdUser = async (id) => {

  const data = await EmployerDetails.aggregate([
    {
      $match: {
        $and: [{ userId: { $eq: id } }],
      },
    }, 
    {
      $project:{
        keySkill:1,
        date:1,
        active:1,
        jobTittle:1,
        designation:1,
        recruiterName:1,
        contactNumber:1,
        jobDescription:1,
        salaryRangeFrom:1,
        salaryRangeTo:1,
        experienceFrom:1,
        experienceTo:1,
        interviewType:1,
        candidateDescription:1,
        workplaceType:1,
        industry:1,
        interviewerName:1,
        preferredindustry:1,
        functionalArea:1,
        role:1,
        jobLocation:1,
        employmentType:1,
        openings:1,
        interviewDate:1,
        interviewTime:1,
        location:1,
        interviewerName:1,
        interviewerContactNumber:1,
        validity:1,
        educationalQualification:1,
        userId:1,
       expiredDate:1,
       createdAt:1,
       adminStatus:{
        $cond: {
          if: {
            $eq: ['$date', "$expiredDate"]
          },
          then:"Expired",
          else:"$adminStatus",
        }
      },
       
      //  companyName:"$employerregistrations.companyName",
      //  email:"$employerregistrations.email",
      //  mobileNumber:"$employerregistrations.mobileNumber",
      //  companyType:"$employerregistrations.companyType",
      //  name:"$employerregistrations.name",
      //  regitserStatus:"$employerregistrations.adminStatus",
      }
    }
  ])
  return data
}


const getById = async (id) =>{
    const data = await EmployerDetails.findById(id)
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
    }
    return data
}

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

module.exports = {
    createEmpDetails,
    getByIdUser,
    deleteById,
    updateById,
};