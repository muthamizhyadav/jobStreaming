const httpStatus = require('http-status');
const { CandidateRegistration } = require('../models');
const { OTPModel } = require('../models');
const ApiError = require('../utils/ApiError');

const createCandidate = async (userBody) => {
    const {password,confirmpassword} = userBody
  if (await CandidateRegistration.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if(password != confirmpassword){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Confirm Password Incorrect');
  }

 let data = await CandidateRegistration.create(userBody);
 return data
};


// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

const verify_email = async (token, otp) =>{
    const data = await OTPModel.findOne({token:token, otp:otp})
    if(data == null){
        throw new ApiError(httpStatus.BAD_REQUEST, 'incorrect otp');
    }
    const data1 = await CandidateRegistration.findByIdAndUpdate({_id:data.userId}, {isEmailVerified:true}, {new:true})
    return data1
}


const UsersLogin = async (userBody) => {
    const { email, password } = userBody;
    let userName = await CandidateRegistration.findOne({ email: email });
    if (!userName) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email Not Registered');
    } else {
      if (await userName.isPasswordMatch(password)) {
        console.log('Password Macthed');
      } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Passwoed Doesn't Match");
      }
    }
    return userName;
  };


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
    createCandidate,
    verify_email,
    UsersLogin,
//   getUserById,
//   getUserByEmail,
//   updateUserById,
//   deleteUserById,
};