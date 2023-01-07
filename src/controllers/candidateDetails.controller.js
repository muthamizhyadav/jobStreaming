const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const candidateDetailsService = require('../services/candidateDetails.service');
const User = require('../models/user.model');


const createkeySkill = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await candidateDetailsService.createkeySkill(userId, req.body);
  // console.log(req.files)
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
       path  = "resumes/images/"+files.filename
    });
    user.image = path
  }
  res.status(httpStatus.CREATED).send({ user });
  await user.save();
});


const getByIdUser = catchAsync(async(req,res) => {
    let userId = req.userId
    const user = await candidateDetailsService.getByIdUser(userId)
    res.send({user})
})

const updateById = catchAsync(async(req,res) => {
  let userId = req.userId 
    const user = await candidateDetailsService.updateById(userId, req.body)
    // console.log(req.files)
    if (req.files.length != 0 ) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
       path  = "resumes/images/"+files.filename
    });
    user.image = path
  }
    await user.save();
    res.send({user})
})



const deleteById = catchAsync(async(req,res) => {
    const user = await candidateDetailsService.deleteById(req.params.id)
    res.send({user})
})



const candidateSearch = catchAsync(async(req,res) => {
  const user = await candidateDetailsService.candidateSearch(req.body)
  res.send({user})
})


const getByIdEmployerDetailsShownCandidate = catchAsync(async(req,res) => {
  let userId = req.userId
  const user = await candidateDetailsService.getByIdEmployerDetailsShownCandidate(req.params.id, userId)
  res.send(user)
})

const createCandidatePostjob = catchAsync(async (req, res) => {
  let userId = req.userId
const user = await candidateDetailsService.createCandidatePostjob(userId, req.body);
res.status(httpStatus.CREATED).send({ user });
});

const createCandidateSavejob = catchAsync(async (req, res) => {
  let userId = req.userId
  const user = await candidateDetailsService.createCandidateSavejob(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
  });

const getByIdAppliedJobs = catchAsync(async (req, res) => {
    let userId = req.userId
    const user = await candidateDetailsService.getByIdAppliedJobs(userId);
    res.send(user)
    });

    const applyJobsView = catchAsync(async (req, res) => {
      const user = await candidateDetailsService.applyJobsView(req.params.userId);
      res.send(user)
      });

const deleteByIdSavejOb = catchAsync(async (req, res) => {
    const user = await candidateDetailsService.deleteByIdSavejOb(req.params.id);
    res.send(user)
  });

  const getByIdSavedJobs = catchAsync(async (req, res) => {
    let userId = req.userId
    const user = await candidateDetailsService.getByIdSavedJobs(userId);
    res.send(user)
    });


    const getByIdSavedJobsView = catchAsync(async (req, res) => {
      const user = await candidateDetailsService.getByIdSavedJobs(req.params.userId);
      res.send(user)
      });
  

    // const createSearchCandidate = catchAsync(async (req, res) => {
    //   const user = await candidateDetailsService.createSearchCandidate(req.body);
    //   res.status(httpStatus.CREATED).send({ user }
    //     );
    //   });


const autojobSearch = catchAsync(async (req, res) => {
     let userId = req.userId
     const user = await candidateDetailsService.autojobSearch(userId);
     res.send(user)
 });

 const createdSearchhistory = catchAsync(async (req, res) => {
    let userId = req.userId
    const user = await candidateDetailsService.createdSearchhistory(userId, req.body);
    res.send(user)
});

const CandidateRegistrations = catchAsync(async (req, res) => {
    const user = await candidateDetailsService.CandidateRegistrations(req.params.page);
    res.send(user)
});

const updateByIdCandidateRegistration = catchAsync(async (req, res) => {
  const user = await candidateDetailsService.updateByIdCandidateRegistration(req.params.id, req.body);
   res.send(user)
});

const createSetSearchEmployerData = catchAsync(async (req, res) => {
  const userId = req.userId
const user = await candidateDetailsService.createSetSearchEmployerData(userId, req.body);
res.status(httpStatus.CREATED).send({ user });
});

const updateByIdcandidataSearchEmployerSet = catchAsync(async (req, res) => {
  const user = await candidateDetailsService.updateByIdcandidataSearchEmployerSet(req.params.id, req.body);
  res.send(user)
});

const SearchByIdcandidataSearchEmployerSet = catchAsync(async (req, res) => {
  const userId = req.userId
  const user = await candidateDetailsService.SearchByIdcandidataSearchEmployerSet(userId);
  res.send(user)
});

const getByIdEmployerDetails = catchAsync(async (req, res) => {
  const user = await candidateDetailsService.getByIdEmployerDetails(req.params.id);
  res.send(user)
});

const candidateSearch_front_page = catchAsync(async (req, res) => {
  const userId = req.userId
  const user = await candidateDetailsService.candidateSearch_front_page(userId, req.body);
  res.send(user)
});
module.exports = {
  createkeySkill,
  getByIdUser,
  updateById,
  deleteById,
  candidateSearch,
  getByIdEmployerDetailsShownCandidate,
  createCandidatePostjob,
  createCandidateSavejob,
  getByIdAppliedJobs,
  deleteByIdSavejOb,
  getByIdSavedJobs,
  applyJobsView,
  getByIdSavedJobsView,
  autojobSearch,
  createdSearchhistory,
  CandidateRegistrations,
  updateByIdCandidateRegistration,
  createSetSearchEmployerData,
  updateByIdcandidataSearchEmployerSet,
  SearchByIdcandidataSearchEmployerSet,
  getByIdEmployerDetails,
  candidateSearch_front_page,
  // createSearchCandidate,
};