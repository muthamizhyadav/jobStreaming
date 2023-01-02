const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const candidateRegistration = require('../../controllers/candidateRegistration.controller');
const uploadImage = require('../../middlewares/upload');
const auth = require('../../middlewares/auth');
const authorization = require('../../controllers/tokenVerify.controller');

const router = express.Router();

router.route('/register').post(uploadImage.array('resume'),candidateRegistration.register);

router.route('/userDetails').get(authorization, candidateRegistration.getUserById);

router.route('/verify_email').put(candidateRegistration.verify_email);
router.route('/login').post(candidateRegistration.login);
router.route('/forgot').post(candidateRegistration.forgot);
router.route('/forgot_verify_email').post(candidateRegistration.forgot_verify_email);
router.route('/change_password/:id').put(candidateRegistration.change_password);
router.route('/getMap/Location').get(candidateRegistration.getMapLocation);
router.route('/mobile_verify').post(candidateRegistration.mobile_verify);
router.route('/mobile_verify_Otp').post(candidateRegistration.mobile_verify_Otp);
router.route('/forget_password').post(candidateRegistration.forget_password);
router.route('/forget_password_Otp').post(candidateRegistration.forget_password_Otp);
router.route('/forget_password_set/:id').post(candidateRegistration.forget_password_set);
// router.post('/logout', validate(authValidation.logout), authController.logout);
// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
// router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;