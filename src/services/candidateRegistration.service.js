const httpStatus = require('http-status');
const { CandidateRegistration, User } = require('../models');
const { OTPModel } = require('../models');
const {emailService} = require('../services');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const Axios = require('axios');

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


const getUserById = async (id) => {
     const data  = await CandidateRegistration.findById(id)
     if (!data){
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Registration');
     }    
};

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

const forgot_verify_email = async (body) =>{
    const {id, otp} = body
    console.log(id,otp)
    const data = await OTPModel.findOne({userId:id, otp:otp})
    if(data == null){
        throw new ApiError(httpStatus.BAD_REQUEST, 'incorrect otp');
    }
    const data1 = await CandidateRegistration.findByIdAndUpdate({_id:data.userId}, {isEmailVerified:true}, {new:true})
    return data1
}


const forgot = async (body) => {
    const data = await CandidateRegistration.findOne({email:body.email})
    if(!data){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email Not Registered');
    }
    await emailService.sendforgotEmail(data.email, data._id)
    return data
}


const change_password = async (id, body) =>{

    const { password, confirmpassword } = body;
    if (password != confirmpassword) {
      throw new ApiError(httpStatus.NOT_FOUND, 'confirmpassword wrong');
    }
    const salt = await bcrypt.genSalt(10);
    let password1 = await bcrypt.hash(password, salt);
    const data = await CandidateRegistration.findByIdAndUpdate({ _id: id }, { password: password1 }, { new: true });
    return data;
}


const getMapLocation = async (query) => {
  let response = await Axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.long}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
  );
  return response.data;
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
    forgot,
    forgot_verify_email,
    change_password,
    getUserById,
    getMapLocation,
//   getUserById,
//   getUserByEmail,
//   updateUserById,
//   deleteUserById,
};