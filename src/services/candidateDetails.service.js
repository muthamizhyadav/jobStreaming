const httpStatus = require('http-status');
const { KeySkill } = require('../models/candidateDetails.model');
const { CandidateRegistration } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

//keySkill

const createkeySkill = async (userId, userBody) => {
    console.log(userId)
    let values = {...userBody, ...{userId:userId}}
 let data = await KeySkill.create(values);
 return data
};

const getByIdUser = async (id) => {
    const data = await CandidateRegistration.aggregate([
      {
        $match: {
          $and: [{ _id: { $eq: id } }],
        },
      }, 
      {
        $lookup: {
          from: 'candidatedetails',
          localField: '_id',
          foreignField: 'userId',
          as: 'candidatedetails',
        },
      },
      { $unwind: '$candidatedetails' },
      {
        $project:{
          resume:1,
          candidateDetails:"$candidatedetails",
        }
      }

    ])
    return data
}

const getById = async (id) =>{
    const data = await KeySkill.findById(id)
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, 'keySkill not found');
    }
    return data
}

const updateById = async (id, updateBody) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Keyskill not found');
  }
  const data = await KeySkill.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
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
    createkeySkill,
    getByIdUser,
    deleteById,
    updateById,
};