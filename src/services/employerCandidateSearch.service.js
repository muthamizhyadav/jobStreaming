const httpStatus = require('http-status');
const { CandiadteSearch } = require('../models/employerCandidateSearch.model');
const {KeySkill} = require('../models/candidateDetails.model');
// const { CandidateRegistration } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');


const createCandidateSearch = async (userId, userBody) => {
    let values = {...userBody, ...{userId:userId}}
 let data = await CandiadteSearch.create(values);
 return data
};

// const searchCandidate = async (key) => {
//     let keyskill = key.keyskill
//     console.log(keyskill)
//      const data = await KeySkill.find({ keyskill: { $elemMatch: {"angular"} } })
//      console.log(data)
//    return data;
// }


module.exports = {
    createCandidateSearch,
    // searchCandidate,
};