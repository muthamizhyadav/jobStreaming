const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const employerRegistration = require('../../controllers/employerRegistration.controller');
// const uploadImage = require('../../middlewares/upload');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/register').post(employerRegistration.register);

router.route('/verify_email').put(employerRegistration.verify_email);
router.route('/login').post(employerRegistration.login);
router.route('/forgot').post(employerRegistration.forgot);
router.route('/forgot_verify_email').post(employerRegistration.forgot_verify_email);
router.route('/change_password/:id').put(employerRegistration.change_password);
// router.post('/logout', validate(authValidation.logout), authController.logout);
// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
// router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;