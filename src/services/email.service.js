const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const  {OTPModel} = require('../models')

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
const sendEmail = async (to, subject, text, token, otp) => {
  const msg = { from: config.email.from, to, subject, text};
  await OTPModel.findOneAndUpdate({token:token},{otp:otp},{ new: true })
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
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // console.log(to, token)
  // replace this url with the link to the email verification page of your front-end app
  var otp = Math.random();
   otp = otp * 1000000;
   otp = parseInt(otp);
   console.log(otp);
   const text = `Dear user, To email verification, OTP:${otp}. Do not share your otp`
  await sendEmail(to, subject, text, token, otp);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
