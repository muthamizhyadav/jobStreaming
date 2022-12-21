const httpStatus = require('http-status');
const { KeySkill, CandidatePostjob, CandidateSaveJob} = require('../models/candidateDetails.model');
const { CandidateRegistration } = require('../models');
const  {EmployerDetails, EmployerPostjob}  = require('../models/employerDetails.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

//keySkill

const createkeySkill = async (userId, userBody) => {
    console.log(userId)
    let values = {...userBody, ...{userId:userId}}
 let data = await KeySkill.create(values);
 return data
};

const getByIdUser = async (id) => {
    const data = await CandidateRegistration.aggregate([
      {
        $match: {
          $and: [{ _id: { $eq: id } }],
        },
      }, 
      {
        $lookup: {
          from: 'candidatedetails',
          localField: '_id',
          foreignField: 'userId',
          as: 'candidatedetails',
        },
      },
      { $unwind: '$candidatedetails' },
      {
        $project:{
          resume:1,
          candidateDetails:"$candidatedetails",
        }
      }

    ])
    return data
}

const getById = async (id) =>{
    const data = await KeySkill.findById(id)
    if(!data){
        throw new ApiError(httpStatus.NOT_FOUND, 'keySkill not found');
    }
    return data
}

const updateById = async (id, updateBody) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Keyskill not found');
  }
  const data = await KeySkill.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  await data.save();
  return data;
};


const deleteById = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const candidateSearch = async (body) => {
     let {search, experience, location} = body
     if(search != null){
      search = search.split(',');
     console.log(search)
     }
    //  search = ["fbhfghfh","software engineer"]
     experienceSearch = {active:true}
     locationSearch = {active:true}
     if(experience != null){
      experienceSearch = { experienceFrom: { $lte: parseInt(experience) },experienceTo: { $gte: parseInt(experience) } }
     }
     if(location != null){
       locationSearch = { jobLocation: { $eq: location } }
     }
     console.log(experienceSearch)
    const data = await EmployerDetails.aggregate([
      { 
        $match: { 
          $or: [ { designation: { $in: search } },{ keySkill: {$elemMatch:{$in:search}}}] 
      }
    },  
    { 
      $match: { 
        $and: [experienceSearch,locationSearch] 
    }   
   },    
      {
            $lookup: {
              from: 'employerregistrations',
              localField: 'userId',
              foreignField: '_id',
              as: 'employerregistrations',
            },
          },
          {
            $unwind:'$employerregistrations',
          },
    ]) 
    return data 
}

const getByIdEmployerDetailsShownCandidate = async (id,userId) =>{
  // const applyjob = await CandidatePostjob.find({userId:userId})
  const data = await EmployerDetails.aggregate([
    { 
      $match: { 
        $and: [ { _id: { $eq: id } }] 
    }
  }, 
  {
    $lookup: {
      from: 'employerpostjobs',
      localField: '_id',
      foreignField: 'postajobId',
      pipeline:[
        {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
      ],
      as: 'employerpostjobs',
    },
  },
  {
        $unwind: {
          path: '$employerpostjobs',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'candidatepostjobs',
          localField: '_id',
          foreignField: 'jobId',
          pipeline:[
            { 
              $match: { 
                $and: [ { userId: { $eq: userId } }] 
            }
          }, 
          ],
          as: 'candidatepostjobs',
        },
      },
      {
        $unwind: {
          path: '$candidatepostjobs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'candidatesavejobs',
          localField: '_id',
          foreignField: 'savejobId',
          pipeline:[
            { 
              $match: { 
                $and: [ { userId: { $eq: userId } }] 
            }
          }, 
          ],
          as: 'candidatesavejobs',
        },
      },
      {
        $unwind: {
          path: '$candidatesavejobs',
          preserveNullAndEmptyArrays: true,
        },
      },
  {
    $project:{
      keySkill:1,
      jobTittle:1,
      designation:1,
      recruiterName:1,
      contactNumber:1,
      jobDescription:1,
      salaryRangeFrom:1,
      salaryRangeTo:1,
      experienceFrom:1,
      experienceTo:1,
      interviewType:1,
      candidateDescription:1,
      workplaceType:1,
      industry:1,
      preferredindustry:1,
      functionalArea:1,
      role:1,
      jobLocation:1,
      employmentType:1,
      openings:1,
      createdAt:1,
      appliedCount:"$employerpostjobs.count",
      candidatesubmitButton:{ $ifNull: ['$candidatepostjobs', false] },
      saveButton:{$ifNull:["$candidatesavejobs", false]},
    }
  }
  ])
  return data
}

const createCandidatePostjob = async (userBody) => {
  const {userId, jobId} = userBody
 const data = await CandidatePostjob.create(userBody);
  await EmployerPostjob.create({candidateId:userId,postajobId:jobId})
return data
};

const createCandidateSavejob = async (userBody) => {
 const data = await CandidateSaveJob.create(userBody);
return data
};

module.exports = {
    createkeySkill,
    getByIdUser,
    deleteById,
    updateById,
    candidateSearch,
    getByIdEmployerDetailsShownCandidate,
    createCandidatePostjob,
    createCandidateSavejob,
};