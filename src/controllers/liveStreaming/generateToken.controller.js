const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const generateTokenService = require('../../services/liveStreaming/generateToken.service');
const generateToken = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.generateToken(req);
  res.status(httpStatus.CREATED).send(tokens);
});
const getHostTokens = catchAsync(async (req, res) => {
  const tokens = await generateTokenService.getHostTokens(req);
  res.status(httpStatus.CREATED).send(tokens);
});

module.exports = {
  generateToken,
  getHostTokens,
};
