const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const employerDetailsService = require('../services/employerDetails.service');


const createEmpDetails = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await employerDetailsService.createEmpDetails(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});


const getByIdUser = catchAsync(async(req,res) => {
    let userId = req.userId
    const user = await employerDetailsService.getByIdUser(userId)
    res.send({user})
})

const updateById = catchAsync(async(req,res) => {
    const user = await employerDetailsService.updateById(req.params.id, req.body)
    res.send({user})
})


const deleteById = catchAsync(async(req,res) => {
    const user = await employerDetailsService.deleteById(req.params.id)
    res.send()
})

const createEmpDetailsRepost = catchAsync(async(req,res) => {
  const user = await employerDetailsService.createEmpDetailsRepost(req.params.id, req.body)
  res.send({user})
})

module.exports = {
  createEmpDetails,
  getByIdUser,
  updateById,
  deleteById,
  createEmpDetailsRepost,
};