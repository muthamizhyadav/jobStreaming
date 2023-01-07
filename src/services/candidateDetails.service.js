const httpStatus = require('http-status');
const { KeySkill, CandidatePostjob, CandidateSaveJob, CandidateSearchjobCandidate, candidataSearchEmployerSet } = require('../models/candidateDetails.model');
const { CandidateRegistration } = require('../models');
const  {EmployerDetails, EmployerPostjob}  = require('../models/employerDetails.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const moment = require('moment');
//keySkill

const createkeySkill = async (userId, userBody) => {
    console.log(userId)
    let secondarySkill ;
    let pasrSkill ;
    let keySkill = userBody.keyskill.split(',');
    let currentSkill = userBody.currentSkill.split(',');
    let preferredSkill = userBody.preferredSkill.split(',');
    if(userBody.secondarySkill != null){
        secondarySkill = userBody.secondarySkill.split(',');
     }
    if(userBody.pasrSkill != null){
      pasrSkill= userBody.pasrSkill.split(',');
     }
    let date = moment().format('YYYY-MM-DD');
    let creat1 = moment().format('HHmmss');
    let values = {...userBody, ...{userId:userId, date: date, time:creat1, keyskill:keySkill, currentSkill:currentSkill, preferredSkill:preferredSkill, secondarySkill:secondarySkill, pasrSkill:pasrSkill}}
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
          lat:1,
          long:1,
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

const updateById = async (userId, updateBody) => {
  const user = await KeySkill.findOne({userId:userId})
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Keyskill not found');
  }
  const data = await KeySkill.findOneAndUpdate({ userId: userId }, updateBody, { new: true });
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
        $and: [ { adminStatus: { $eq: "Approved" } },experienceSearch,locationSearch] 
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
      from: 'employerregistrations',
      localField: 'userId',
      foreignField: '_id',
      as: 'employerregistrations',
    },
  },
  {
    $unwind:'$employerregistrations',
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
      companyType:"$employerregistrations.companyType",
      companyName:"$employerregistrations.companyName",
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
      candidatesubmitButton:{ $ifNull: ['$candidatepostjobs.status', false] },
      saveButton:{$ifNull:["$candidatesavejobs.status", false]},
    }
  }
  ])
  return data
}

const createCandidatePostjob = async (userId, userBody) => {
  const {jobId} = userBody
 const data = await CandidatePostjob.create({...userBody, ...{userId:userId}});
  await EmployerPostjob.create({candidateId:userId,postajobId:jobId})
return data
};

const createCandidateSavejob = async (userId, userBody) => {
 const data = await CandidateSaveJob.create({...userBody, ...{userId:userId}});
return data
};


const getByIdAppliedJobs = async (userId) => {
  console.log(userId)
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
    jobTittle:"$employerdetails.jobTittle",
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
    jobTittle:"$employerdetails.jobTittle",
    candidatepostjobsStatus:{ $ifNull: ['$employerdetails.candidatepostjobs.status', false] },
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
    jobTittle:"$employerdetails.jobTittle",
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
  // console.log(userId)
//  { keySkill: {$elemMatch:{$in:search}}}
  const data = await CandidateSearchjobCandidate.aggregate([
    { 
      $match: { 
        $and: [ { userId: { $eq: userId } }] 
    }
  },
 {
    $lookup:{
     from: 'employerdetails',
     let:{keySkill: '$keyskill'},
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

const CandidateRegistrations = async (page) => {
  const data = await CandidateRegistration.find().limit(10).skip(10 * page)
  let  count = await CandidateRegistration.find()

  return {data:data, count:count.length} ;
}

const updateByIdCandidateRegistration = async (id, updateBody) => {
   const user = await CandidateRegistration.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'candidateRegistration not found');
  }
  const data = await CandidateRegistration.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  await data.save();
  return data;
};

const createSetSearchEmployerData = async (userId, userBody) => {
  console.log(userId)
  let values = {...userBody, ...{userId:userId}}
let data = await candidataSearchEmployerSet.create(values);
return data
};


const updateByIdcandidataSearchEmployerSet = async (id, updateBody) => {
  const user = await candidataSearchEmployerSet.findById(id)
 if (!user) {
   throw new ApiError(httpStatus.NOT_FOUND, 'candidataSearchEmployerSet not found');
 }
 const data = await candidataSearchEmployerSet.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
 await data.save();
 return data;
};

const SearchByIdcandidataSearchEmployerSet = async (userId) => {
  // const user = await KeySkill.aggregate([

  // ])
// let products1 = []
 const user = await KeySkill.findOne({userId:userId}) 
   let search = user.keyskillSet
    let locetion = user.locationSet
    let expYear = user.experienceYeaSet
  if(!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'candidateDetails not found');
  }
    // console.log(search,locetion)
//  user.forEach(async (e) => {
//   // const product = await Product.findById(e)
//   products1.push(e);
// });
// const data = await EmployerDetails.find({ keySkill: {$elemMatch:{$in:user.keyskillSet}}, location:user.locationSet})
//    user.forEach(async (e) => {
//   // const product = await Product.findById(e)
//   products1.push(e);
// });
//  experienceSearch = { experienceFrom: { $lte: parseInt(expYear) },experienceTo: { $gte: parseInt(expYear) } }

 const data = await EmployerDetails.aggregate([
  { 
    $match: { 
      $or: [ { location: { $eq: locetion } },{ keySkill: {$elemMatch:{$in:search}}}, { experienceFrom: { $lte: parseInt(expYear) },experienceTo: { $gte: parseInt(expYear) } }] 
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
  $unwind:"$employerregistrations"
},
{
  $project:{
    keySkill:1,
    date:1,
    adminStatus:1,
    active:1,
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
    interviewerName:1,
    preferredindustry:1,
    functionalArea:1,
    role:1,
    jobLocation:1,
    employmentType:1,
    openings:1,
    interviewDate:1,
    interviewTime:1,
    location:1,
    interviewerName:1,
    interviewerContactNumber:1,
    validity:1,
    educationalQualification:1,
    userId:1,
   expiredDate:1,
   createdAt:1,
   companyName:"$employerregistrations.companyName",
   email:"$employerregistrations.email",
   mobileNumber:"$employerregistrations.mobileNumber",
   companyType:"$employerregistrations.companyType",
   name:"$employerregistrations.name",
   regitserStatus:"$employerregistrations.adminStatus",
  }
}
 ])
   return data;

};

const getByIdEmployerDetails = async (id) =>{
  const data = await EmployerDetails.findById(id)
  if(!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'employerDetails not found');
  }
  return data
}


const candidateSearch_front_page = async (id, body) => {
  // console.log(userId)
  const check = await  CandidateRegistration.findById(id)
  if(!check){
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  // let values = {...body, ...{userId:userId}}
     let {search, experience, location} = body
  //  await CandidateSearchjobCandidate.create(values);

    //  search = ["fbhfghfh","software engineer"]
     let experienceSearch = {active:true}
     let locationSearch = {active:true}
     let allSearch = [{active:true}]
     if(search != null){
      search = search.split(',');
      allSearch = [ { designation: { $in: search } },{ keySkill: {$elemMatch:{$in:search}}}]
     }

     if(experience != null){
      experienceSearch = { experienceFrom: { $lte: parseInt(experience) },experienceTo: { $gte: parseInt(experience) } }
     }
     if(location != null){
       locationSearch = { jobLocation: { $eq: location } }
     }
    //  console.log(allSearch)
    const data = await EmployerDetails.aggregate([
      { 
        $match: { 
          $or:allSearch 
      }
    },  
    { 
      $match: { 
        $and: [ { adminStatus: { $eq: "Approved" } }, experienceSearch, locationSearch] 
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