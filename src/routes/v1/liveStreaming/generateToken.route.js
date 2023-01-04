const express = require('express');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/auth.controller');
const auth = require('../../../middlewares/auth');

const router = express.Router();
const generateToken = require('../../../controllers/liveStreaming/generateToken.controller');

router.post('/getToken', generateToken.generateToken);
router.get('/getHostTokens', generateToken.getHostTokens);
router.get('/gettoken/byId', generateToken.gettokenById);
router.get('/gettoken/host/byId', generateToken.gettokenById_host);
router.get('/getparticipents/limit', generateToken.participents_limit);
router.put('/leave/participents/limit', generateToken.leave_participents);
router.get('/leave/host', generateToken.leave_host);
router.get('/join/host/admin', generateToken.join_host);
router.post('/recording/acquire', generateToken.agora_acquire);
router.post('/recording/start', generateToken.recording_start);
router.post('/recording/query', generateToken.recording_query);
router.post('/recording/stop', generateToken.recording_stop);
router.post('/recording/updateLayout', generateToken.recording_updateLayout);
router.post('/chat/room/details', generateToken.chat_rooms);
router.get('/getsub/token/user', generateToken.get_sub_token);


module.exports = router;
