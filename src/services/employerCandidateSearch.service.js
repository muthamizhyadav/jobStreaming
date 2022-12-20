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

const searchCandidate = async (key) => {
    let keyskill = key.keyskill
    let keywords = key.keywords
    let _keyskill = { active: true };
    let _keywords = { active: true};
    keywords = ["hjkhgjk"]
    if(keyskill != null){
        _keyskill = { keyskill: {$elemMatch:{$in:keyskill}}}
    }if(keywords != null){
        _keywords = {$or:[{ currentSkill: {$elemMatch:{$in:keywords}}},{ preferredSkill: {$elemMatch:{$in:keywords}}},{ pasrSkill: {$elemMatch:{$in:keywords}}},{ secondarySkill: {$elemMatch:{$in:keywords}}}]}
    }
    // console.log(_keywords)
    const data = await KeySkill.aggregate([
          {
            $match: {
              $or: [_keyskill],
            },
          },
          {
            $match: _keywords
          },
          {
            $lookup: {
              from: 'candidateregistrations',
              localField: 'userId',
              foreignField: '_id',
              as: 'candidateregistrations',
            },
          },
          {
            $unwind:'$candidateregistrations',
          },
    ])

   return data;
}


module.exports = {
    createCandidateSearch,
    searchCandidate,
};