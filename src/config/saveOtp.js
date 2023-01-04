const {OTPModel} = require('../models');
const moment = require('moment');

const saveOtp = async (body, OTPCODE) => {
//  const data =  await OTPModel.findOne({mobileNumber:body.mobileNumber})
//  if(data){
//    await OTPModel.findOneAndUpdate({mobileNumber:body.mobileNumber}, {otp:OTPCODE}, {new:true})
//  }else{
//    await OTPModel.create({otp: OTPCODE, mobileNumber:body.mobileNumber, userId:body._id});
//  }
 await OTPModel.create({otp: OTPCODE, mobileNumber:body.mobileNumber, userId:body._id});
  };

  const UpdatesaveOtp = async (body, OTPCODE) => {
    await OTPModel.findOneAndUpdate({userId:body._id}, {otp: OTPCODE}, {new:true});
  };
module.exports = { saveOtp, UpdatesaveOtp};