const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const keySkillSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    image:{
        type:String,
    },
    keyskill: {
        type:Array,
    },
    userId:{
        type:String,
    },
    experienceMonth:{
        type:Number
    },
    experienceYear:{
        type:Number
    },
    salaryRangeFrom:{
        type:Number,
    },
    salaryRangeTo:{
        type:Number,
    },
    locationNative:{
        type:String,
    },
    locationCurrent:{
        type:String,
    },
    education:{
        type:String,
    },
    course:{
        type:String,
    },
    specification:{
        type:String,
    },
    university:{
        type:String,
    },
    courseType:{
        type:String,
    },
    passingYear:{
        type:Number,
    },
    gradingSystem:{
        type:String,
    },
    availability:{
        type:String,
    },
    currentSkill:{
        type:Array,
    },
    preferredSkill:{
        type:Array,
    },
    secondarySkill:{
        type:Array,
    },
    pasrSkill:{
        type:Array,
    },
    gender:{
        type:String,
    },
    maritalStatus:{
        type:String,
    },
    mark:{
        type:String,
    },
    Jobtype:{
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
const KeySkill = mongoose.model('candidateDetail', keySkillSchema);
const candidatePostjobSchema = mongoose.Schema(
    {
      _id: {
        type: String,
        default: v4,
      },
      userId:{
        type:String
      },
      jobId:{
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
  const CandidatePostjob = mongoose.model('candidatePostjob', candidatePostjobSchema);
  const candidateSaveJobSchema = mongoose.Schema(
    {
      _id: {
        type: String,
        default: v4,
      },
      userId:{
        type:String
      },
      savejobId:{
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
  const CandidateSaveJob = mongoose.model('candidateSaveJob', candidateSaveJobSchema);
module.exports = {KeySkill, CandidatePostjob, CandidateSaveJob} ;