const httpStatus = require('http-status');
const { EmployerDetails } = require('../models/employerDetails.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

//keySkill

const createEmpDetails = async (userId, userBody) => {
    console.log(userId)
    let values = {...userBody, ...{userId:userId}}
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
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
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