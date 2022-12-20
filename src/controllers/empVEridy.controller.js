const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tokenTypes } = require('../config/tokens');
const jwt = require('jsonwebtoken');
const tokenService = require('../services/token.service');
const config = require('../config/config');
const { EmployerRegistration } = require('../models');

const authorization = async (req, res, next) => {
  const token = req.headers.auth;
  // console.log(token);
  // console.log(req.headers.auth);
  // console.log(req.headers['auth']);
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'user must be LoggedIn....');
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload);
    const userss = await EmployerRegistration.findOne({ _id: payload.sub, active: true });
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Available');
    }
    req.userId = payload.sub;
    // req.userRole = payload.userRole;

    return next();
  } catch {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
  }
};

module.exports = authorization;