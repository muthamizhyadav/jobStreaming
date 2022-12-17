const httpStatus = require('http-status');
const { CandidateRegistration } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    const {password,confirmpassword} = userBody
  if (await CandidateRegistration.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if(password != confirmpassword){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Confirm Password Incorrect');
  }
  return CandidateRegistration.create();
};


// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };


// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };

module.exports = {
  createUser,
//   getUserById,
//   getUserByEmail,
//   updateUserById,
//   deleteUserById,
};