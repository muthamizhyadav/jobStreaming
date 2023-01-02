const {OTPModel} = require('../models');
const moment = require('moment');

const saveOtp = async (body, OTPCODE) => {
    await OTPModel.create({otp: OTPCODE, mobileNumber:body.mobileNumber, userId:body._id});
  };
module.exports = { saveOtp };