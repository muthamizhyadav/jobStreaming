const httpStatus = require('http-status');
const { CandiadteSearch, CreateSavetoFolder} = require('../models/employerCandidateSearch.model');
const {EmployerDetails, EmployerPostjob} = require('../models/employerDetails.model');
const {KeySkill, CandidateSaveJob} = require('../models/candidateDetails.model');
const {EmployerRegistration} = require('../models')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');


const createCandidateSearch = async (userId, userBody) => {
    let values = {...userBody, ...{userId:userId}}
 let data = await CandiadteSearch.create(values);
 return data
};


const employerSearchCandidate = async (id) =>{
  let data = await KeySkill.aggregate([
    { 
      $match: { 
        $and: [ { _id: { $eq: id } }] 
    }
  },
  {
    $lookup: {
      from: 'candidateregistrations',
      localField: 'userId',
      foreignField: '_id',
      pipeline:[
        {
          $lookup: {
            from: 'savetofolderemployersearches',
            localField: '_id',
            foreignField: 'candidateId',
            as: 'savetofolderemployersearches',
          },
        },
        {
          $unwind: {
            path: '$savetofolderemployersearches',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
      as: 'candidateregistrations',
    },
  },
  {
    $unwind:'$candidateregistrations',
  },
  {
    $project:{
      keyskill:1,
      currentSkill:1,
      preferredSkill:1,
      secondarySkill:1,
      pasrSkill:1,
      experienceMonth:1,
      experienceYear:1,
      salaryRangeFrom:1,
      salaryRangeTo:1,
      locationNative:1,
      locationCurrent:1,
      education:1,
      specification:1,
      university:1,
      courseType:1,
      passingYear:1,
      gradingSystem:1,
      availability:1,
      gender:1,
      maritalStatus:1,
      image:1,
      userId:1,
      createdAt:1,
      saveDataOrNot:{ $ifNull: ['$candidateregistrations.savetofolderemployersearches.status', false] },
      candidateregistrations:"$candidateregistrations",
    }
  }
  ])
  return data ;
}


const searchCandidate = async (key) => {
  console.log(key)
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
    if(keyskill != null && keyskill != ""){
         keyskill = keyskill.split(',');
        _keyskill = { keyskill: {$elemMatch:{$in:keyskill}}}
    }
    if(keywords != null && keywords != ""){
         keywords = keywords.split(',');
        _keywords = {$or:[{ currentSkill: {$elemMatch:{$in:keywords}}},{ preferredSkill: {$elemMatch:{$in:keywords}}},{ pasrSkill: {$elemMatch:{$in:keywords}}},{ secondarySkill: {$elemMatch:{$in:keywords}}}]}
    }
    if(locationCurrent != null && locationCurrent != "" ){
        _location = { locationCurrent:{$eq:locationCurrent}}
    }
    if(courseType != null || courseType != ""){
        _courseType = { courseType:{$eq:courseType}}
    }
    if((passingYearFrom != null && passingYearTo != null) && (passingYearFrom != "" && passingYearTo != "")){
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


const createSavetoFolder = async (userId, userBody) => {
  let values = {...userBody, ...{userId:userId}}
let data = await CreateSavetoFolder.create(values);
return data
};

const employerPost_Jobs  = async (userId) => {
  let data = await EmployerDetails.aggregate([
    { $sort: { date: -1 } },
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
  // {
  //   $lookup: {
  //     from: 'employerregistrations',
  //     localField: 'userId',
  //     foreignField: '_id',
  //     as: 'employerregistrations',
  //   },
  // },
  // {
  //   $unwind:'$employerregistrations',
  // },
  ])
  return data
}

const employer_job_post_edit = async (id, updateBody) =>{
  const user = await EmployerDetails.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'post a Job not found');
  }
  const data = await EmployerDetails.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  await data.save();
  return data;
}


const candidatdeSaveJobRemove = async (id) =>{
  const data = await CandidateSaveJob.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'savejob not found');
  }
  await data.remove();
  return data;
}

const candidate_applied_Details = async (id) => {
    const data = await EmployerPostjob.aggregate([
      { 
        $match: { 
          $and: [ { postajobId: { $eq: id } }] 
      }
    },
     {
    $lookup: {
      from: 'candidateregistrations',
      localField: 'candidateId',
      foreignField: '_id',
      as: 'candidateregistrations',
    },
  },
  {
    $unwind:'$candidateregistrations',
  },
     
    ])
    return data ;
}


const candidate_applied_Details_view = async (id) => {
  const data = await KeySkill.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: id } }] 
    }
  },
  {
    $lookup: {
      from: 'candidateregistrations',
      localField: 'userId',
      foreignField: '_id',
      pipeline:[
        {
          $lookup: {
            from: 'savetofolderemployersearches',
            localField: '_id',
            foreignField: 'candidateId',
            as: 'savetofolderemployersearches',
          },
        },
        {
          $unwind: {
            path: '$savetofolderemployersearches',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
      as: 'candidateregistrations',
    },
  },
  {
    $unwind:'$candidateregistrations',
  },
  {
    $project:{
      keyskill:1,
      currentSkill:1,
      preferredSkill:1,
      secondarySkill:1,
      pasrSkill:1,
      experienceMonth:1,
      experienceYear:1,
      salaryRangeFrom:1,
      salaryRangeTo:1,
      locationNative:1,
      locationCurrent:1,
      education:1,
      specification:1,
      university:1,
      courseType:1,
      passingYear:1,
      gradingSystem:1,
      availability:1,
      gender:1,
      maritalStatus:1,
      image:1,
      userId:1,
      createdAt:1,
      saveDataOrNot:{ $ifNull: ['$candidateregistrations.savetofolderemployersearches.status', false] },
      candidateregistrations:"$candidateregistrations",
    }
  }
   
  ])
  return data ;
}

const saveSearchData_EmployerSide = async (userId) => {
    const data = await CandiadteSearch.aggregate([
      { 
        $match: { 
          $and: [ { userId: { $eq: userId } }] 
      }
    },

    ])
    return data;
}


const employerRemovePostJobs = async (id) => {
  const data = await CandiadteSearch.findById(id)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'savejob not found');
  }
  await data.remove();
  return data;
};

const allFolderData = async (userId) => {
  console.log(userId)
  const data = await CreateSavetoFolder.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
  {
    $lookup: {
      from: 'candidateregistrations',
      localField: 'candidateId',
      foreignField: '_id',
      pipeline:[
        {
          $lookup: {
            from: 'candidatedetails',
            localField: '_id',
            foreignField: 'userId',
            as: 'candidatedetails',
          },
        },
        {
          $unwind: {
            path: '$candidatedetails',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
      as: 'candidateregistrations',
    },
  },
  {
    $unwind:'$candidateregistrations',
   },
  {
    $project:{
      status:1,
      candidateId:1,
      folderName:1,
      userId:1,
      // createdAt:1,
      // updatedAt:1,
      name:"$candidateregistrations.name",
      email:"$candidateregistrations.name",
      workStatus:"$candidateregistrations.name",
      mobileNumber:"$candidateregistrations.name",
      resume:"$candidateregistrations.name",
      keyskill:"$candidateregistrations.candidatedetails.keyskill",
      currentSkill:"$candidateregistrations.candidatedetails.currentSkill",
      preferredSkill:"$candidateregistrations.candidatedetails.preferredSkill",
      secondarySkill:"$candidateregistrations.candidatedetails.secondarySkill",
      pasrSkill:"$candidateregistrations.candidatedetails.pasrSkill",
      locationCurrent:"$candidateregistrations.candidatedetails.locationCurrent",
      // userId:"$candidateregistrations.candidatedetails.userId",
   }
  },
  // {
  //   $group: {
  //     _id: { folderName: '$folderName' },
  //     email : { $addToSet : "$email" }
  //   },
  // },
  ])
  return data;
}

module.exports = {
    createCandidateSearch,
    searchCandidate,
    employerSearchCandidate,
    createSavetoFolder,
    employerPost_Jobs,
    employer_job_post_edit,
    candidate_applied_Details,
    candidate_applied_Details_view,
    saveSearchData_EmployerSide,
    employerRemovePostJobs,
    allFolderData,
    candidatdeSaveJobRemove,
    
};