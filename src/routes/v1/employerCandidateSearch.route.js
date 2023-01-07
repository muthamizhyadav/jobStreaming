const express = require('express');
const validate = require('../../middlewares/validate');
const employerCandidateSearch = require('../../controllers/employerCandidateSearch.controller');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/').post(authorization,employerCandidateSearch.createCandidateSearch);
router.route('/createSaveSeprate').post(authorization,employerCandidateSearch.createSaveSeprate);
router.route('/searchQuery').post(employerCandidateSearch.searchQuery);
router.route('/employerSearchCandidate/:id').get(employerCandidateSearch.employerSearchCandidate);
router.route('/createSavetoFolder').post(authorization, employerCandidateSearch.createSavetoFolder);
router.route('/employerPost_Jobs').get(authorization, employerCandidateSearch.employerPost_Jobs);
router.route('/employer_job_post_edit/:id').put(employerCandidateSearch.employer_job_post_edit);
router.route('/candidate_applied_Details/:id').get(employerCandidateSearch.candidate_applied_Details);
router.route('/candidate_applied_Details_view/:id').get(employerCandidateSearch.candidate_applied_Details_view);
router.route('/saveSearchData_EmployerSide').get(authorization, employerCandidateSearch.saveSearchData_EmployerSide);
router.route('/employerRemovePostJobs/:id').delete(employerCandidateSearch.employerRemovePostJobs);
router.route('/allFolderData/:id').get(employerCandidateSearch.allFolderData);
router.route('/candidatdeSaveJobRemove/:id').delete(employerCandidateSearch.candidatdeSaveJobRemove);
router.route('/saveFolderData_view').get(authorization, employerCandidateSearch.saveFolderData_view);
router.route('/getSaveSeprate').get(authorization, employerCandidateSearch.getSaveSeprate);
router.route('/delete_Seprate_saveCandidate/:id').delete(employerCandidateSearch.delete_Seprate_saveCandidate);
module.exports = router;