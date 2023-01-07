const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const candidateDetailsController = require('../../controllers/candidateDetails.controller');
const uploadImage = require('../../middlewares/uploadImage');
const authorization = require('../../controllers/tokenVerify.controller');
const authorization1= require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/createKeyskill').post(authorization,uploadImage.array('image'), candidateDetailsController.createkeySkill);

router.route('/getKeyskill').get(authorization,candidateDetailsController.getByIdUser);
router.route('/updateKeyskill').put(authorization, uploadImage.array('image'), candidateDetailsController.updateById);
router.route('/deleteKeyskill/:id').delete(candidateDetailsController.deleteById);
router.route('/candidateSearch').post(candidateDetailsController.candidateSearch);
router.route('/getByIdEmployerDetailsShownCandidate/:id').get(authorization, candidateDetailsController.getByIdEmployerDetailsShownCandidate);
router.route('/createCandidatePostjob').post(authorization, candidateDetailsController.createCandidatePostjob);
router.route('/createCandidateSavejob').post(authorization, candidateDetailsController.createCandidateSavejob);
router.route('/getByIdAppliedJobs').get(authorization, candidateDetailsController.getByIdAppliedJobs);
router.route('/deleteByIdSavejOb/:id').delete(candidateDetailsController.deleteByIdSavejOb);
router.route('/getByIdSavedJobs').get(authorization, candidateDetailsController.getByIdSavedJobs);
router.route('/applyJobsView/:userId').get(candidateDetailsController.applyJobsView);
router.route('/getByIdSavedJobsView/:userId').get(candidateDetailsController.getByIdSavedJobsView);
router.route('/autojobSearch').get(authorization, candidateDetailsController.autojobSearch);
router.route('/createdSearchhistory').post(authorization, candidateDetailsController.createdSearchhistory);
router.route('/CandidateRegistrations/:page').get(candidateDetailsController.CandidateRegistrations);
router.route('/updateByIdCandidateRegistration/:id').put(candidateDetailsController.updateByIdCandidateRegistration);
router.route('/createSetSearchEmployerData').post(authorization, candidateDetailsController.createSetSearchEmployerData);
router.route('/updateByIdcandidataSearchEmployerSet/:id').put(candidateDetailsController.updateByIdcandidataSearchEmployerSet);
router.route('/SearchByIdcandidataSearchEmployerSet').get(authorization,candidateDetailsController.SearchByIdcandidataSearchEmployerSet);
router.route('/getByIdEmployerDetails/:id').get(candidateDetailsController.getByIdEmployerDetails);
router.route('/candidateSearch_front_page').post(authorization, candidateDetailsController.candidateSearch_front_page);
// router.route('/createSearchCandidate').post(authorization, candidateDetailsController.createSearchCandidate);
module.exports = router;