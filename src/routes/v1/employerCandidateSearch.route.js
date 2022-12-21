const express = require('express');
const validate = require('../../middlewares/validate');
const employerCandidateSearch = require('../../controllers/employerCandidateSearch.controller');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/').post(authorization,employerCandidateSearch.createCandidateSearch);
router.route('/searchQuery').post(employerCandidateSearch.searchQuery);

module.exports = router;