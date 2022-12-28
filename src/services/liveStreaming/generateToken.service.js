const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { tempTokenModel } = require('../../models/liveStreaming/generateToken.model');
const axios = require('axios'); //
const appID = '08bef39e0eb545338b0be104785c2ae1';
const appCertificate = 'bfb596743d2b4414a1895ac2edb1d1f0';
const Authorization = `Basic ${Buffer.from(`8f68dcbfe5494cf8acf83d5836a1effc:b222bdfa2a5a4a04afccacb60b1fa2a1`).toString(
  'base64'
)}`;

const generateToken = async (req) => {
  const expirationTimeInSeconds = 3600;
  const uid = req.body.uid;
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const channel = req.body.channel;

  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(30, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  let value = await tempTokenModel.create({
    ...req.body,
    ...{
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HHMMSS'),
      created: moment(),
      Uid: uid,
      participents: 3,
      created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
      expDate: expirationTimestamp * 1000,
    },
  });
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, value._id, uid, role, expirationTimestamp);
  value.token = token;
  value.chennel = value._id;
  value.save();
  return { uid, token, value };
};
const generateToken_sub = async (req) => {
  const expirationTimeInSeconds = 3600;
  const uid = req.body.uid;
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const channel = req.body.channel;

  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(30, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  let value = await tempTokenModel.create({
    ...req.body,
    ...{
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HHMMSS'),
      created: moment(),
      Uid: uid,
      chennel: channel,
      participents: 3,
      created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
      expDate: expirationTimestamp * 1000,
    },
  });
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, expirationTimestamp);
  value.token = token;
  value.save();
  return { uid, token, value };
};

const getHostTokens = async (req) => {
  let time = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let value = await tempTokenModel.aggregate([
    {
      $sort: {
        created: -1,
      },
    },
    {
      $match: {
        $and: [{ expDate: { $gte: time - 60 } }, { type: { $eq: 'host' } }],
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'hostId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'active_users',
      },
    },
    {
      $unwind: {
        path: '$active_users',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'temptokens',
        localField: '_id',
        foreignField: 'hostId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: false } }],
            },
          },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        as: 'total_users',
      },
    },
    {
      $unwind: {
        path: '$total_users',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        type: 1,
        date: 1,
        Uid: 1,
        chennel: 1,
        participents: 1,
        created_num: 1,
        expDate: 1,
        created: 1,
        active_users: { $ifNull: ['$active_users.count', 0] },
        In_active_users: { $ifNull: ['$total_users.count', 0] },
        total_user: { $sum: ['$total_users.count', '$active_users.count'] },
        active: 1,
      },
    },
  ]);
  return value;
};

const gettokenById = async (req) => {
  let value = await tempTokenModel.findById(req.id);
  return value;
};
const leave_participents = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.id }, { active: false }, { new: true });
  return value;
};

const leave_host = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.id }, { active: false }, { new: true });
  return value;
};
const join_host = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.id }, { active: true }, { new: true });
  return value;
};

const participents_limit = async (req) => {
  let participents = await tempTokenModel.findById(req.id);
  let value = await tempTokenModel.find({ hostId: req.id, active: true }).count();
  return { participents: value >= participents.participents ? false : true };
};

const agora_acquire = async (req) => {
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      cname: 'test',
      uid: '54369',
      clientRequest: {
        resourceExpiredHour: 24,
      },
    },
    { headers: { Authorization } }
  );

  return acquire.data;
};

const recording_start = async (req) => {
  console.log(req.body);
  const resource = req.body.resource;
  const mode = req.body.mode;
  const start = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
    {
      cname: 'test',
      uid: '54369',
      clientRequest: {
        token:
          '00608bef39e0eb545338b0be104785c2ae1IAAllYVqg5jKp8ZDb44DK1m2MdF7mRfYO52sY5Qw3op8mwx+f9ip7Z4gIgD5p8MGG7mqYwQAAQDHaKljAgDHaKljAwDHaKljBADHaKlj',
        recordingConfig: {
          maxIdleTime: 30,
          streamTypes: 2,
          channelType: 0,
          videoStreamType: 0,
          transcodingConfig: {
            height: 640,
            width: 360,
            bitrate: 500,
            fps: 15,
            mixedVideoLayout: 1,
            backgroundColor: '#FFFFFF',
          },
        },
        recordingFileConfig: {
          avFileType: ['hls'],
        },
        storageConfig: {
          vendor: 1,
          region: 2,
          bucket: 'arn:aws:s3:::streamingupload',
          accessKey: 'AKIA3323XNN7Y2RU77UG',
          secretKey: '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',
          fileNamePrefix: ['directory1', 'directory2'],
        },
      },
    },
    { headers: { Authorization } }
  );

  return start.data;
};
const recording_query = async (req) => {
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      cname: 'test',
      uid: '54369',
      clientRequest: {
        resourceExpiredHour: 24,
      },
    },
    { headers: { Authorization } }
  );

  return acquire.data;
};
const recording_stop = async (req) => {
  const resource = req.body.resource;
  const sid = req.body.sid;
  const mode = req.body.mode;
  console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`);
  const stop = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
    {
      cname: 'test',
      uid: '29872',
      clientRequest: {},
    },
    { headers: { Authorization } }
  );

  return stop.data;
};
const recording_updateLayout = async (req) => {
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      cname: 'test',
      uid: '16261',
      clientRequest: {
        resourceExpiredHour: 24,
      },
    },
    { headers: { Authorization } }
  );

  return acquire.data;
};
module.exports = {
  generateToken,
  getHostTokens,
  gettokenById,
  participents_limit,
  leave_participents,
  leave_host,
  join_host,
  agora_acquire,
  recording_start,
  recording_query,
  recording_stop,
  recording_updateLayout,
  generateToken_sub,
};
