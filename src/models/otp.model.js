const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const otpSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  otp: {
    type: Number,
  },
  userId:{
    type:String,
  },
  mobileNumber:{
    type:Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const OTPModel = new mongoose.model('OTP', otpSchema);

module.exports = OTPModel;