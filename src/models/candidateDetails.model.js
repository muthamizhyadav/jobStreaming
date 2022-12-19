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
    keyskill: {
        type:Array,
    },
    userId:{
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
const KeySkill = mongoose.model('keySkill', keySkillSchema);
module.exports = {KeySkill} ;