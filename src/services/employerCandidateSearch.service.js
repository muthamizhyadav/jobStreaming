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
    let locationCurrent = key.location
    let courseType = key.courseType
    let passingYearFrom = key.passingYearFrom
    let passingYearTo = key.passingYearTo
  
    // if (parseInt(passingYearFrom) <= parseInt(passingYearTo)) {
    //     to = parseInt(passingYearFrom);
    //     from = parseInt(passingYearTo);
    //   } else {
    //     to = parseInt(passingYearTo);
    //     from = parseInt(passingYearFrom);
    //   }
    let _keyskill = { active: true };
    let _keywords = { active: true };
    let _location = {active:true};
    let _courseType = {active:true};
    let _passingYearFrom = {active:true};
    //  let _passingYearTo = {active:true};

    // keywords = ["hjkhgjk"]
    // locationCurrent = "chennai"
    if(keyskill != null){
         keyskill = keyskill.split(',');
        _keyskill = { keyskill: {$elemMatch:{$in:keyskill}}}
    }
    if(keywords != null){
         keywords = keywords.split(',');
        _keywords = {$or:[{ currentSkill: {$elemMatch:{$in:keywords}}},{ preferredSkill: {$elemMatch:{$in:keywords}}},{ pasrSkill: {$elemMatch:{$in:keywords}}},{ secondarySkill: {$elemMatch:{$in:keywords}}}]}
    }
    if(locationCurrent != null){
        _location = { locationCurrent:{$eq:locationCurrent}}
    }
    if(courseType != null){
        _courseType = { courseType:{$eq:courseType}}
    }
    if(passingYearFrom != null && passingYearTo != null){
        _passingYearFrom = { passingYear: { $gte: parseInt(passingYearFrom) } },{ passingYear: { $lte: parseInt(passingYearTo) } }
    }
    const data = await KeySkill.aggregate([
          {
            $match: {
              $or: [_location, _courseType, _passingYearFrom],
            },
          },
          {
            $match: {
              $and: [_keyskill],
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