const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const candidateDetailsService = require('../services/candidateDetails.service');


const createkeySkill = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await candidateDetailsService.createkeySkill(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});


const getByIdUser = catchAsync(async(req,res) => {
    let userId = req.userId
    const user = await candidateDetailsService.getByIdUser(userId)
    res.send({user})
})

const updateById = catchAsync(async(req,res) => {
    const user = await candidateDetailsService.updateById(req.params.id)
    res.send({user})
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