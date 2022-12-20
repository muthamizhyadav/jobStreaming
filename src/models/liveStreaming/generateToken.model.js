const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resume: {
      type: String,
    },
    workStatus: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const CandidateRegistration = mongoose.model('candidateRegistration', userSchema);
module.exports = CandidateRegistration;
