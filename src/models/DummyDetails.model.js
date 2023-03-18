const mongoose = require('mongoose');
const { v4 } = require('uuid');

const DummyDetails = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Language: {
    type: Array,
    default: [],
  },
  SingleEducation: {
    type: Array,
    default: [],
  },
  educationDetails: {
    type: Array,
    default: [],
  },
  active: {
    type: String,
  },
});

const Dummy = mongoose.model('dummy', DummyDetails);
module.exports = Dummy;
