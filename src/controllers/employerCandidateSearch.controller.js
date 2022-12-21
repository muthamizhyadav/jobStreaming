const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const employerCandidateSearch = require('../services/employerCandidateSearch.service');


const createCandidateSearch = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await employerCandidateSearch.createCandidateSearch(userId, req.body);
  res.status(httpStatus.CREATED).send({ user }
    );
});

const searchQuery = catchAsync(async(req,res) => {
    // console.log(req.query)
    const user = await employerCandidateSearch.searchCandidate(req.body)
    res.send({user})
})



module.exports = {
    createCandidateSearch,
    searchQuery,
};