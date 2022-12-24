const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const employerDetailsSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    jobTittle: {
        type:String,
    },
    userId:{
        type:String,
    },
    designation:{
        type:String,
    },
    recruiterName:{
        type:String,
    },
    contactNumber:{
        type:Number,
    },
    jobDescription:{
        type:String,
    },
    keySkill:{
        type:Array,
    },
    salaryRangeFrom:{
        type:Number,
    },
    salaryRangeTo:{
        type:Number,
    },
    preferredindustry:{
        type:String,
    },
    educationalQualification:{
        type:String,
    },
    experienceFrom:{
        type:Number,
    },
    experienceTo:{
        type:Number,
    },
    interviewType:{
        type:String,
    },
    candidateDescription:{
        type:String,
    },
    workplaceType:{
        type:String,
    },
    industry:{
        type:String,
    },
    preferedIndustry:{
        type:String,
    },
    functionalArea:{
        type:String,
    },
    role:{
        type:String,
    },
    jobLocation:{
        type:String,
    },
    employmentType:{
        type:String,
    },
    openings:{
        type:Number,
    },
    interviewDate:{
        type:String,
    },
    interviewTime:{
        type:String,
    },
    interviewerName:{
        type:String,
    },
    interviewerContactNumber:{
        type:Number,
    },
    location:{
        type:String,
    },
    adminStatus:{
        type:String,
        default:"Pending",
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
const EmployerDetails = mongoose.model('employerDetail', employerDetailsSchema);
const employerPostjobSchema = mongoose.Schema(
    {
      _id: {
        type: String,
        default: v4,
      },
      postajobId: {
          type:String,
      },
      candidateId:{
          type:String,
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
  const EmployerPostjob = mongoose.model('employerPostjob', employerPostjobSchema);
module.exports = {EmployerDetails, EmployerPostjob} ;