const {OTPModel} = require('../models');
const moment = require('moment');

const saveOtp = async (body, OTPCODE) => {
    await OTPModel.create({otp: OTPCODE, mobileNumber:body.mobileNumber, userId:body._id});
  };

  const UpdatesaveOtp = async (body, OTPCODE) => {
    await OTPModel.findOneAndUpdate({userId:body._id}, {otp: OTPCODE}, {new:true});
  };
module.exports = { saveOtp, UpdatesaveOtp};