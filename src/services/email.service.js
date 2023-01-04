const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const  {OTPModel} = require('../models')
const  {EmployeOtp} = require('../models')

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: "muthamizhyadav@gmail.com", to, subject, text};
  // await OTPModel.findOneAndUpdate({token:token},{otp:otp, userId:userId},{ new: true })
  await transport.sendMail(msg);
};

const sendEmailEmp = async (to, subject, text) => {
  const msg = { from: "muthamizhyadav@gmail.com", to, subject, text};
  // await EmployeOtp.findOneAndUpdate({token:token},{otp:otp, userId:userId},{ new: true })
  await transport.sendMail(msg);
};

const forgetEmail = async (to, subject, text, otp, userId) => {
  const msg = { from: "muthamizhyadav@gmail.com", to, subject, text};
  await OTPModel.findOneAndUpdate({userId:userId},{otp:otp},{ new: true })
  await transport.sendMail(msg);
};

const forgetEmailEmp = async (to, subject, text, otp, userId) => {
  const msg = { from: "muthamizhyadav@gmail.com", to, subject, text};
  await EmployeOtp.findOneAndUpdate({userId:userId},{otp:otp},{ new: true })
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmailEmp = async (to, token, mobilenumber) => {
  const subject = 'Email Verification';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://job.lotsmart.in/#/EmployeeVerifyOTP?mobilenumber=${mobilenumber}`;
  const text = `Dear user,
To set your password, click on this link: ${resetPasswordUrl}
If you did not request any password sets, then ignore this email.`;
  await sendEmailEmp(to, subject, text, token);
};


const sendVerificationEmail = async (to, token, mobilenumber) => {
  const subject = 'Email Verification';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://job.lotsmart.in/#/VeriftOPT?mobilenumber=${mobilenumber}`;
  const text = `Dear user,
To set your password, click on this link: ${resetPasswordUrl}
If you did not request any password sets, then ignore this email.`;
  await sendEmail(to, subject, text, token);
};


const sendforgotEmail = async (to,userId) => {
  const subject = 'Forget Password';
  // console.log(to, token)
  // replace this url with the link to the email verification page of your front-end app
  var otp = Math.random();
   otp = otp * 1000000;
   otp = parseInt(otp);
  //  console.log(otp);
   const text = `Dear user, To Forget Password, OTP:${otp}. Do not share your otp`
  await forgetEmail(to, subject, text, otp, userId);
};

const sendforgotEmailEmp = async (to,userId) => {
  const subject = 'Forget Password';
  // console.log(to, token)
  // replace this url with the link to the email verification page of your front-end app
  var otp = Math.random();
   otp = otp * 1000000;
   otp = parseInt(otp);
  //  console.log(otp);
   const text = `Dear user, To Forget Password, OTP:${otp}. Do not share your otp`
  await forgetEmailEmp(to, subject, text, otp, userId);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendforgotEmail,
  forgetEmail,
  forgetEmailEmp,
  sendVerificationEmailEmp,
  sendforgotEmailEmp,
};
