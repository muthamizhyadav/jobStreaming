const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const generateTokenService = require('../../services/liveStreaming/generateToken.service');



const generateToken = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.generateToken(req);
    req.io.emit('subscriberjoined', {user: 'sd'});
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

const participents_limit = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.participents_limit(req.query);
  req.io.emit('subscriberjoined', {user: 'sd'});
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_participents = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_participents(req.query);
  req.io.emit('subscriberjoined', {user: 'sd'});
  res.status(httpStatus.CREATED).send(tokens);
});

module.exports = {
  generateToken,
  getHostTokens,
  gettokenById,
  participents_limit,
  leave_participents,
};
