const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createPlanService = require('../services/createPlan.service');


const createPlan = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await createPlanService.createPlan(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});


const plan_view = catchAsync(async (req, res) => {
  const userId = req.userId
  const data = await createPlanService.plan_view(userId)
  res.send({data});
})

const updateById = catchAsync(async(req,res) => {
  const user = await createPlanService.updateById(req.params.id, req.body)
  res.send({user})
})

module.exports = {
    createPlan,
    plan_view,
    updateById,
};