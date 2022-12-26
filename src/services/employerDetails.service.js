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
    // {
    //   $project:{
    //     keySkill:1,

    //   }
    // }

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