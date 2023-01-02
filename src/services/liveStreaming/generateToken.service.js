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


const generateUid= async (req) => {
  const length = 5;
  const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
  return randomNo;
}



const generateToken = async (req) => {
  const expirationTimeInSeconds = 3600;
  const uid =  await generateUid()
  const uid_cloud =  await generateUid()
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;

  const moment_curr = moment();
  const currentTimestamp = moment_curr.add(30, 'minutes');
  const expirationTimestamp =
    new Date(new Date(currentTimestamp.format('YYYY-MM-DD') + ' ' + currentTimestamp.format('HH:mm:ss'))).getTime() / 1000;
  let channel = new Date().getTime().toString();
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
  console.log(role)
  const token = await geenerate_rtc_token(value._id,uid,role,expirationTimestamp);
  value.token = token;
  value.chennel = value._id;
 let cloud_recording =await geenerate_rtc_token(channel,uid_cloud, 2,expirationTimestamp);
 value.uid_cloud = uid_cloud;
 value.cloud_recording = cloud_recording;
 value.save();

  return { uid, token, value };
};
const geenerate_rtc_token =async (chennel, uid, role, expirationTimestamp)=>{
    return Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, chennel, uid, role, expirationTimestamp);
}

const generateToken_sub = async (req) => {
  const expirationTimeInSeconds = 3600;
  const uid = await generateUid()
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
  console.log(role)
  const token =await geenerate_rtc_token(channel,uid,role,expirationTimestamp);
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
const gettokenById_host= async (req) => {
  let value = await tempTokenModel.findById(req.id);
  const uid = await generateUid()
  const role = Agora.RtcRole.PUBLISHER ;
  const token = await geenerate_rtc_token(value.chennel,uid,role,value.expDate/1000);
  value.token=token;
  value.Uid=uid;
  value.save();
  return value;
};
const leave_participents = async (req) => {
  let value = await tempTokenModel.findByIdAndUpdate({ _id: req.query.id }, { active: false }, { new: true });
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
  let token = await tempTokenModel.findById(req.body.id);
  console.log(token._id);
  console.log(token.Uid);
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/acquire`,
    {
      cname: token._id,
      uid: token.Uid.toString(),
      clientRequest: {
        resourceExpiredHour: 24,
      },
    },
    { headers: { Authorization } }
  );

  return await recording_start(acquire.data, token);
};

const recording_start = async (res, token) => {
  // let token = await tempTokenModel.findById(req.body.id);

  const resource = res.resourceId;
  const mode = 'mix';
  let dir = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  console.log(dir);
  // console.log(
  //   // res.resourceId,
  //   `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`
  // );
  const start = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
    {
      cname: token._id,
      uid: token.Uid.toString(),
      clientRequest: {
        // token: token.token,
        recordingConfig: {
          maxIdleTime: 1300,
          streamTypes: 2,
          channelType: 1,
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
          region: 14,
          bucket: 'streamingupload',
          accessKey: 'AKIA3323XNN7Y2RU77UG',
          secretKey: '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',
          fileNamePrefix: [dir.toString(), token.Uid.toString()],
        },
      },
    },
    { headers: { Authorization } }
  );

  return { start: start.data, acquire: res };
};
const recording_query = async (req) => {
  const resource = req.body.resource;
  const sid = req.body.sid;
  const mode = 'mix';
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  );
  return query.data;
};
const recording_stop = async (req) => {
  const resource = req.body.resource;
  const sid = req.body.sid;
  const mode = 'mix';
  let token = await tempTokenModel.findById(req.body.id);
  console.log(resource);
  console.log(sid);
  console.log(token.Uid.toString());
  console.log(token._id);
  const stop = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
    {
      cname: token._id,
      uid: token.Uid.toString(),
      clientRequest: {
        // async_stop: false,
      },
    },
    {
      headers: {
        Authorization,
      },
    }
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
  gettokenById_host
};
