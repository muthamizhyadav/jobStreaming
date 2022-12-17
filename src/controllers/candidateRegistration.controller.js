const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, candidateRegistrationService} = require('../services');
const  {OTPModel}  = require('../models');

const register = catchAsync(async (req, res) => {
  const user = await candidateRegistrationService.createCandidate(req.body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
       path  = "resumes/"+files.filename
    });
    user.resume = path
  }
  const tokens = await tokenService.generateAuthTokens(user);
   await OTPModel.create({token:tokens.access.token});
  res.status(httpStatus.CREATED).send({ user, tokens });
  await user.save();
  console.log(user._id)
  await emailService.sendVerificationEmail(user.email, tokens.access.token, user._id)
});


const verify_email = catchAsync(async(req,res) => {
    const {token,otp} = req.body
    const user = await candidateRegistrationService.verify_email(token, otp)
    res.send({user})
})


const login = catchAsync(async (req, res) => {
  const user = await candidateRegistrationService.UsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const sendVerificationEmail = catchAsync(async (req, res) => {
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const verifyEmail = catchAsync(async (req, res) => {
//   await authService.verifyEmail(req.query.token);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  register,
  verify_email,
  login,
//   logout,
//   refreshTokens,
//   forgotPassword,
//   resetPassword,
//   sendVerificationEmail,
//   verifyEmail,
};