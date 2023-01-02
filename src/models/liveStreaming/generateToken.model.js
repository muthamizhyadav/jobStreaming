const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const tempToken = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  token: {
    type: String,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  expDate: {
    type: Number,
  },
  created_num: {
    type: Number,
  },
  participents: {
    type: Number,
  },
  chennel: {
    type: String,
  },
  Uid: {
    type: Number,
  },
  type: {
    type: String,
  },
  hostId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  cloud_recording:{
    type: String,
  },
  uid_cloud:{
    type: String,
  },
  cloud_id:{
    type: String,
  },
  store:{
    type: String,
  }
});

const tempTokenModel = mongoose.model('tempToken', tempToken);
module.exports = { tempTokenModel };
