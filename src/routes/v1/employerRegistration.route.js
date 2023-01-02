const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const employerRegistration = require('../../controllers/employerRegistration.controller');
// const uploadImage = require('../../middlewares/upload');
const auth = require('../../middlewares/auth');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/register').post(employerRegistration.register);
router.route('/userDetails').get(authorization, employerRegistration.getUserById);

router.route('/verify_email').put(employerRegistration.verify_email);
router.route('/login').post(employerRegistration.login);
router.route('/forgot').post(employerRegistration.forgot);
router.route('/forgot_verify_email').post(employerRegistration.forgot_verify_email);
router.route('/change_password/:id').put(employerRegistration.change_password);
router.route('/employerRegistration/:page').get(employerRegistration.employerRegistration);
router.route('/employerRegistration_Approved/:page').get(employerRegistration.employerRegistration_Approved);
router.route('/updateByIdEmployerRegistration/:id').put(employerRegistration.updateByIdEmployerRegistration);
router.route('/mobile_verify').post(employerRegistration.mobile_verify);
router.route('/mobile_verify_Otp').post(employerRegistration.mobile_verify_Otp);
router.route('/forget_password').post(employerRegistration.forget_password);
router.route('/forget_password_Otp').post(employerRegistration.forget_password_Otp);
router.route('/forget_password_set/:id').post(employerRegistration.forget_password_set);
// router.post('/logout', validate(authValidation.logout), authController.logout);
// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
// router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;