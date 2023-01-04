const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { Groupchat } = require('../../models/liveStreaming/chat.model');



const chat_room_create = async (req,io) => {
    console.log(req)
    let dateIso= new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
    let data=await Groupchat.create({...req,...{created:moment(),dateISO:dateIso}})
    io.sockets.emit(req.channel, data);
}

const getoldchats=async (req) => {
    console.log(req)
    let data=await Groupchat.find({channel:req.query.channel}).sort({dateISO:1});
    return data;
}

module.exports = {
  chat_room_create,
  getoldchats
};
