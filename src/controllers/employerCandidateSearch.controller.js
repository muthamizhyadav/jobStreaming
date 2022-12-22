const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const employerCandidateSearch = require('../services/employerCandidateSearch.service');


const createCandidateSearch = catchAsync(async (req, res) => {
    let userId = req.userId
  const user = await employerCandidateSearch.createCandidateSearch(userId, req.body);
  res.status(httpStatus.CREATED).send({ user }
    );
});

const searchQuery = catchAsync(async(req,res) => {
    // console.log(req.query)
    const user = await employerCandidateSearch.searchCandidate(req.body)
    res.send({user})
})

const employerSearchCandidate = catchAsync(async(req,res) => {
    // console.log(req.query)
    const user = await employerCandidateSearch.employerSearchCandidate(req.params.id)
    res.send({user})
})

const createSavetoFolder = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await employerCandidateSearch.createSavetoFolder(userId, req.body);
  res.status(httpStatus.CREATED).send({ user }
    );
});


const employerPost_Jobs = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await employerCandidateSearch.employerPost_Jobs(userId);
  res.send({user})
});

const employer_job_post_edit = catchAsync(async (req, res) => {
  const user = await employerCandidateSearch.employer_job_post_edit(req.params.id, req.body);
  res.send({user})
});


const candidate_applied_Details = catchAsync(async (req, res) => {
    const user = await employerCandidateSearch.candidate_applied_Details(req.params.id);
    res.send({user})
});

const candidate_applied_Details_view = catchAsync(async (req, res) => {
    const user = await employerCandidateSearch.candidate_applied_Details_view(req.params.id);
    res.send({user})
});

const saveSearchData_EmployerSide = catchAsync(async (req, res) => {
    const userId = req.userId
    const user = await employerCandidateSearch.saveSearchData_EmployerSide(userId);
    res.send({user})
});

const employerRemovePostJobs = catchAsync(async(req,res) => {
    const user = await employerCandidateSearch.employerRemovePostJobs(req.params.id)
    res.send()
})


const allFolderData = catchAsync(async(req,res) => {
    const userId = req.userId
    const user = await employerCandidateSearch.allFolderData(userId)
    res.send({user})
})

module.exports = {
    createCandidateSearch,
    searchQuery,
    employerSearchCandidate,
    createSavetoFolder,
    employerPost_Jobs,
    employer_job_post_edit,
    candidate_applied_Details,
    candidate_applied_Details_view,
    saveSearchData_EmployerSide,
    employerRemovePostJobs,
    allFolderData,
};