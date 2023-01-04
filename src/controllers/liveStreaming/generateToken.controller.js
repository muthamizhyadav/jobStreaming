const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const generateTokenService = require('../../services/liveStreaming/generateToken.service');

const generateToken = catchAsync(async (req, res) => {
  let tokens;
  if (req.body.type == 'host') {
    tokens = await generateTokenService.generateToken(req);
  } else {
    tokens = await generateTokenService.generateToken_sub(req);
  }
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});
const getHostTokens = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.getHostTokens(req);
  res.status(httpStatus.CREATED).send(tokens);
});

const gettokenById = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.gettokenById(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const gettokenById_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.gettokenById_host(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const participents_limit = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.participents_limit(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_participents = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_participents(req);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_host(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});

const join_host = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.join_host(req.query);
  req.io.emit('subscriberjoined', { user: 'sd' });
  res.status(httpStatus.CREATED).send(tokens);
});
const agora_acquire = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.agora_acquire(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_start = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_start(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_query = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_query(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_stop = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_stop(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const recording_updateLayout = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.recording_updateLayout(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});
const chat_rooms= catchAsync(async (req, res) => {
  const tokens = await generateTokenService.chat_rooms(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});

const get_sub_token= catchAsync(async (req, res) => {
  const tokens = await generateTokenService.get_sub_token(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});

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
  gettokenById_host,
  chat_rooms,
  get_sub_token
};
