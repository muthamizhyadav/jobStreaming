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
    const user = await candidateDetailsService.updateById(req.params.id, req.body)
    if (req.files) {
      let path = '';
      req.files.forEach(function (files, index, arr) {
         path  = "resumes/images/"+files.filename
      });
      user.image = path
    }
    res.send({user})
    await user.save();
})


const deleteById = catchAsync(async(req,res) => {
    const user = await candidateDetailsService.deleteById(req.params.id)
    res.send({user})
})

module.exports = {
  createkeySkill,
  getByIdUser,
  updateById,
  deleteById,
};