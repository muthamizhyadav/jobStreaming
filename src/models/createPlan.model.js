const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');
const moment = require('moment');

const  createPlanSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    planName:{
        type:String,
    },
    jobPost: {
        type:String,
    },
    userId:{
        type:String,
    },
    cvAccess:{
        type:String,
    },
    cost:{
        type:Number,
    },
    offer:{
        type:String,
    },
    validityOfPlan:{
        type:Number,
    },
    validityOfPlanExpiry:{
        type:String,
    },
    numberOfMassMailer:{
        type:Number,
    },
    jobPostVAlidity:{
        type:Number,
    },
    jobPostVAlidityExpiry:{
        type:String,
    },
    date:{
      type:String,
      // default:moment().format('YYYY-MM-DD')
    },
    time: {
      type: String,
      // default:moment().format('HHmmss')
    },
    active:{
        type:Boolean,
        default:true,
    }
  },
  {
    timestamps: true,
  }
);
const CreatePlan = mongoose.model('createPlan', createPlanSchema);
module.exports = {CreatePlan} ;