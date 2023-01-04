const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');


const Groupchat_schema = mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    dateISO: {
        type: Number,
    },
    created: {
        type: Date,
    },
    userId: {
        type: String,
    },
    channel: {
        type: String,
    },
    text: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    }

});

const Groupchat = mongoose.model('groupchat', Groupchat_schema);
module.exports = { Groupchat };
