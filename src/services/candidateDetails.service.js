const httpStatus = require('http-status');
const { KeySkill, CandidatePostjob, CandidateSaveJob, CandidateSearchjobCandidate } = require('../models/candidateDetails.model');
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
      {
        $project:{
          resume:1,
          email:1,
          workStatus:1,
          mobileNumber:1,
          name:1,
          resume:1,
          createdAt:1,
          updatedAt:1,
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

// const createSearchCandidate = async (userId, userBody) => {
//   console.log(userId)
//   let values = {...userBody, ...{userId:userId}}
// let data = await CandidateSearchjobCandidate.create(values);
// return data
// };

const candidateSearch = async (body) => {
  // console.log(userId)
  // let values = {...body, ...{userId:userId}}
     let {search, experience, location} = body

     if(search != null){
      search = search.split(',');
     console.log(search)
     }
  //  await CandidateSearchjobCandidate.create(values);

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


const getByIdAppliedJobs = async (userId) => {
  // console.log(userId)
   const data = await CandidatePostjob.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
  {
    $lookup: {
      from: 'employerdetails',
      localField: 'jobId',
      foreignField: '_id',
      pipeline:[
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
          $lookup: {
            from: 'employerregistrations',
            localField: 'userId',
            foreignField: '_id',
            as: 'employerregistrations',
          },
        },
       {
          $unwind:"$employerregistrations"
       }
      ],
      as: 'employerdetails',
    },
  },
 {
    $unwind:"$employerdetails"
 },
 {
  $project:{
    userId:1,
    companyType:"$employerdetails.employerregistrations.companyType",
    companyName:"$employerdetails.employerregistrations.companyName",
    designation:"$employerdetails.designation",
    recruiterName:"$employerdetails.recruiterName",
    contactNumber:"$employerdetails.contactNumber",
    jobDescription:"$employerdetails.jobDescription",
    salaryRangeFrom:"$employerdetails.salaryRangeFrom",
    salaryRangeTo:"$employerdetails.salaryRangeTo",
    experienceFrom:"$employerdetails.experienceFrom",
    experienceTo:"$employerdetails.experienceTo",
    interviewType:"$employerdetails.interviewType",
    candidateDescription:"$employerdetails.candidateDescription",
    workplaceType:"$employerdetails.workplaceType",
    industry:"$employerdetails.industry",
    preferredindustry:"$employerdetails.preferredindustry",
    functionalArea:"$employerdetails.functionalArea",
    role:"$employerdetails.role",
    jobLocation:"$employerdetails.jobLocation",
    employmentType:"$employerdetails.employmentType",
    openings:"$employerdetails.openings",
    createdAt:"$employerdetails.createdAt",
    updatedAt:"$employerdetails.updatedAt",
    candidatesavejobs:{ $ifNull: ['$employerdetails.candidatesavejobs', false] },
  }
 }
   ])
   return data 
}

const applyJobsView = async (userId) =>{
  const data = await CandidatePostjob.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
   },
   {
    $lookup: {
      from: 'employerdetails',
      localField: 'jobId',
      foreignField: '_id',
      pipeline:[
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
          $lookup: {
            from: 'employerregistrations',
            localField: 'userId',
            foreignField: '_id',
            as: 'employerregistrations',
          },
        },
       {
          $unwind:"$employerregistrations"
       }
      ],
      as: 'employerdetails',
    },
  },
 {
    $unwind:"$employerdetails"
 },
 {
  $project:{
    userId:1,
    companyType:"$employerdetails.employerregistrations.companyType",
    companyName:"$employerdetails.employerregistrations.companyName",
    designation:"$employerdetails.designation",
    recruiterName:"$employerdetails.recruiterName",
    contactNumber:"$employerdetails.contactNumber",
    jobDescription:"$employerdetails.jobDescription",
    salaryRangeFrom:"$employerdetails.salaryRangeFrom",
    salaryRangeTo:"$employerdetails.salaryRangeTo",
    experienceFrom:"$employerdetails.experienceFrom",
    experienceTo:"$employerdetails.experienceTo",
    interviewType:"$employerdetails.interviewType",
    candidateDescription:"$employerdetails.candidateDescription",
    workplaceType:"$employerdetails.workplaceType",
    industry:"$employerdetails.industry",
    preferredindustry:"$employerdetails.preferredindustry",
    functionalArea:"$employerdetails.functionalArea",
    role:"$employerdetails.role",
    jobLocation:"$employerdetails.jobLocation",
    employmentType:"$employerdetails.employmentType",
    openings:"$employerdetails.openings",
    createdAt:"$employerdetails.createdAt",
    updatedAt:"$employerdetails.updatedAt",
    candidatesavejobs:{ $ifNull: ['$employerdetails.candidatesavejobs', false] },
  }
 }
   ])
   return data 
}

const deleteByIdSavejOb = async (id) => {
  const data = await CandidateSaveJob.findById(id)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'savejob not found');
  }
  await data.remove();
  return data;
};

const getByIdSavedJobs = async (userId) => {
  // console.log(userId)
   const data = await CandidateSaveJob.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
  {
    $lookup: {
      from: 'employerdetails',
      localField: 'savejobId',
      foreignField: '_id',
      pipeline:[
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
            from: 'employerregistrations',
            localField: 'userId',
            foreignField: '_id',
            as: 'employerregistrations',
          },
        },
       {
          $unwind:"$employerregistrations"
       }
      ],
      as: 'employerdetails',
    },
  },
 {
    $unwind:"$employerdetails"
 },
 {
  $project:{
    userId:1,
    companyType:"$employerdetails.employerregistrations.companyType",
    companyName:"$employerdetails.employerregistrations.companyName",
    designation:"$employerdetails.designation",
    recruiterName:"$employerdetails.recruiterName",
    contactNumber:"$employerdetails.contactNumber",
    jobDescription:"$employerdetails.jobDescription",
    salaryRangeFrom:"$employerdetails.salaryRangeFrom",
    salaryRangeTo:"$employerdetails.salaryRangeTo",
    experienceFrom:"$employerdetails.experienceFrom",
    experienceTo:"$employerdetails.experienceTo",
    interviewType:"$employerdetails.interviewType",
    candidateDescription:"$employerdetails.candidateDescription",
    workplaceType:"$employerdetails.workplaceType",
    industry:"$employerdetails.industry",
    preferredindustry:"$employerdetails.preferredindustry",
    functionalArea:"$employerdetails.functionalArea",
    role:"$employerdetails.role",
    jobLocation:"$employerdetails.jobLocation",
    employmentType:"$employerdetails.employmentType",
    openings:"$employerdetails.openings",
    createdAt:"$employerdetails.createdAt",
    updatedAt:"$employerdetails.updatedAt",
    candidatepostjobs:{ $ifNull: ['$employerdetails.candidatepostjobs', false] },
  }
 }
   ])
   return data 
}
const getByIdSavedJobsView = async (userId) => {
  // console.log(userId)
   const data = await CandidateSaveJob.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
  {
    $lookup: {
      from: 'employerdetails',
      localField: 'savejobId',
      foreignField: '_id',
      pipeline:[
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
            from: 'employerregistrations',
            localField: 'userId',
            foreignField: '_id',
            as: 'employerregistrations',
          },
        },
       {
          $unwind:"$employerregistrations"
       }
      ],
      as: 'employerdetails',
    },
  },
 {
    $unwind:"$employerdetails"
 },
 {
  $project:{
    userId:1,
    companyType:"$employerdetails.employerregistrations.companyType",
    companyName:"$employerdetails.employerregistrations.companyName",
    designation:"$employerdetails.designation",
    recruiterName:"$employerdetails.recruiterName",
    contactNumber:"$employerdetails.contactNumber",
    jobDescription:"$employerdetails.jobDescription",
    salaryRangeFrom:"$employerdetails.salaryRangeFrom",
    salaryRangeTo:"$employerdetails.salaryRangeTo",
    experienceFrom:"$employerdetails.experienceFrom",
    experienceTo:"$employerdetails.experienceTo",
    interviewType:"$employerdetails.interviewType",
    candidateDescription:"$employerdetails.candidateDescription",
    workplaceType:"$employerdetails.workplaceType",
    industry:"$employerdetails.industry",
    preferredindustry:"$employerdetails.preferredindustry",
    functionalArea:"$employerdetails.functionalArea",
    role:"$employerdetails.role",
    jobLocation:"$employerdetails.jobLocation",
    employmentType:"$employerdetails.employmentType",
    openings:"$employerdetails.openings",
    createdAt:"$employerdetails.createdAt",
    updatedAt:"$employerdetails.updatedAt",
    candidatepostjobs:{ $ifNull: ['$employerdetails.candidatepostjobs', false] },
  }
 }
   ])
   return data 
}

const  createdSearchhistory = async (userId,body) => {
  console.log(userId)
  let values = {...body, ...{userId:userId}}
let data = await CandidateSearchjobCandidate.create(values);
return data
}

const autojobSearch = async (userId) =>{
  console.log(userId)
 
  const data = await CandidateSearchjobCandidate.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
 {
    $lookup:{
     from: 'employerdetails',
     let:{keySkill: '$search'},
     pipeline:[
      { 
        $match: { 
          $expr: {
            $or: [
              { $in: ['$keySkill', '$$keySkill']},
            ],
          },
      }
    }
     ],
     as:"employerdetails"

    }
  },
  // {
  //   $lookup: {
  //     from: 'shops',
  //     let: { street: '$_id' },

  //     pipeline: [
  //       {
  //         $match: {
  //           $expr: {
  //             $eq: ['$$street', '$Strid']
  //           },
  //         },
  //       },
  //     ],
  //     as: 'shopData',
  //   },
  // },
 {
  $project:{
    keySkill:"$employerdetails"
  }
 }
     
  ])
  return data
}

module.exports = {
    createkeySkill,
    getByIdUser,
    deleteById,
    updateById,
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
    createdSearchhistory
    // createSearchCandidate,
};