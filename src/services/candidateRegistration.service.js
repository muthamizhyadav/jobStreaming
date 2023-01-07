const httpStatus = require('http-status');
const { CandidateRegistration, User } = require('../models');
const { OTPModel } = require('../models');
const { Token } = require('../models');
const  sendmail  = require('../config/textlocal');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
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

const verify_email = async (token) => {
      const payload = jwt.verify(token, config.jwt.secret);
      const tokenDoc = await Token.findOne({user: payload.sub, blacklisted: false });
      console.log(tokenDoc,payload)
      if (!tokenDoc) {
        throw new Error('Token not found');
      }
     const data = await CandidateRegistration.findByIdAndUpdate({_id:tokenDoc.user}, {isEmailVerified:true}, {new:true})
      return data;
    };

const mobile_verify = async (mobilenumber) => {
  const data = await CandidateRegistration.findOne({mobileNumber:mobilenumber})
  if(!data) {
    throw new Error('mobileNumber not found');
  }
  if(data.isMobileVerified == true &&  data.isEmailVerified == true){
    throw new Error('mobileNumber already verified...');
  }
  await sendmail.Otp(data)
  return {message:"Send Otp Succesfully"}
}


const mobile_verify_Otp = async (mobilenumber,otp) => {
  const data = await OTPModel.findOne({mobileNumber:mobilenumber, otp:otp})
  if(!data) {
    throw new Error('wrong otp');
  }
  const verify = await CandidateRegistration.findByIdAndUpdate({_id:data.userId}, {isMobileVerified:true, isEmailVerified:true}, {new:true})
  return verify
}


const forget_password = async (mobilenumber) => {
  const data = await CandidateRegistration.findOne({mobileNumber:mobilenumber, active:true})
  if(!data){
    throw new Error('mobileNumber not found');
  }
  await sendmail.forgetOtp(data)
  return {message:'otp send successfully'}
}

const forget_password_Otp = async (body) => { 
   const {mobilenumber, otp} = body
   const data = await OTPModel.findOne({otp:otp, mobileNumber:mobilenumber})
  if(!data){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'otp inValid');
  }
  const verify = await CandidateRegistration.findOne({_id:data.userId}).select("email")
  return verify
}

const forget_password_set = async (id, body) => { 
  const { password, confirmpassword } = body;
  if (password != confirmpassword) {
    throw new ApiError(httpStatus.NOT_FOUND, 'confirmpassword wrong');
  }
  const salt = await bcrypt.genSalt(10);
  let password1 = await bcrypt.hash(password, salt);
  const data = await CandidateRegistration.findByIdAndUpdate({ _id: id }, { password: password1 }, { new: true });
  return data;
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


const change_password = async (id, body) => {

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
    mobile_verify,
    mobile_verify_Otp,
    forget_password,
    forget_password_Otp,
    forget_password_set,
//   getUserById,
//   getUserByEmail,
//   updateUserById,
//   deleteUserById,
};