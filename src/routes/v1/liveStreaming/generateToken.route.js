const express = require('express');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/auth.controller');
const auth = require('../../../middlewares/auth');

const router = express.Router();
const generateToken = require('../../../controllers/liveStreaming/generateToken.controller');

router.get('/getToken', generateToken.generateToken);
router.get('/getHostTokens', generateToken.getHostTokens);
router.get('/gettoken/byId', generateToken.gettokenById);

module.exports = router;
