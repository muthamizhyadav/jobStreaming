const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const candidateDetailsController = require('../../controllers/candidateDetails.controller');
const uploadImage = require('../../middlewares/uploadImage');
const authorization = require('../../controllers/tokenVerify.controller');

const router = express.Router();

router.route('/createKeyskill').post(authorization,uploadImage.array('image'), candidateDetailsController.createkeySkill);

router.route('/getKeyskill').get(authorization,candidateDetailsController.getByIdUser);
router.route('/updateKeyskill/:id').put(uploadImage.array('image'), candidateDetailsController.updateById);
router.route('/deleteKeyskill/:id').delete(candidateDetailsController.deleteById);
router.route('/candidateSearch').post(candidateDetailsController.candidateSearch);

module.exports = router;