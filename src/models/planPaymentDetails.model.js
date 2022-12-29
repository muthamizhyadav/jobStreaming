const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');
const moment = require('moment');

const  paymentSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    planId:{
        type:String,
    },
    userId: {
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
const PlanPayment = mongoose.model('planPayment', paymentSchema);
module.exports = {PlanPayment} ;