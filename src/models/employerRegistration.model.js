const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const userEmpSchema = mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
      // lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    adminStatus:{
      type:String,
      default:"Pending",
    },
    // role: {
    //   type: String,
    //   enum: roles,
    //   default: 'user',
    // },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified:{
      type: Boolean,
      default: false,
    },
    companyType: {
      type: String,
    },
    companyName:{
      type:String,
    },
    pincode: {
        type: Number,
      },
    mobileNumber: {
      type: Number,
    },
    lat:{
      type:String,
    },
    long:{
      type:String,
    },
    freePlanCount:{
      type:Number,
      default:1
    },
     active: {
        type: Boolean,
        default:true,
      },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userEmpSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userEmpSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userEmpSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const EmployerRegistration = mongoose.model('employerRegistration', userEmpSchema);
module.exports = EmployerRegistration