const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { tempTokenModel } = require('../../models/liveStreaming/generateToken.model');

const appID = '08bef39e0eb545338b0be104785c2ae1';
const appCertificate = 'bfb596743d2b4414a1895ac2edb1d1f0';
const generateToken = async (req) => {
  const expirationTimeInSeconds = 3600;
  const uid = req.query.uid;
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const channel = req.query.channel;
  // const currentTimestamp = Math.floor(Date.now() / 1000);
  // const expirationTimestamp = new Date(new Date('2022-12-20 11:51:59')).getTime() / 1000;
  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(5, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, expirationTimestamp);
  // console.log(
  //   moment(new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss')))).format(
  //     'YYYY-MM-DD HH:mm:ss'
  //   )
  // );
  // console.log(
  //   moment(new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss')))).format(
  //     'YYYY-MM-DD HH:mm:ss'
  //   )
  // );
  let value = await tempTokenModel.create({
    token: token,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HHMMSS'),
    created: moment_curr,
    Uid: uid,
    chennel: channel,
    participents: uid,
    created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
    expDate: expirationTimestamp * 1000,
  });
  return { uid, token, value };
};
module.exports = {
  generateToken,
};
