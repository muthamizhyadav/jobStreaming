const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const generateTokenService = require('../../services/liveStreaming/generateToken.service');

let express = require('express');
let app = express();
let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);


const generateToken = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.generateToken(req);
  if(req.body.type !='host'){
    io.emit('subscriber-joined', {user: 'sd'});
  }
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
  res.status(httpStatus.CREATED).send(tokens);
});

const leave_participents = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.leave_participents(req.query);
  res.status(httpStatus.CREATED).send(tokens);
});

module.exports = {
  generateToken,
  getHostTokens,
  gettokenById,
  participents_limit,
  leave_participents,
};
