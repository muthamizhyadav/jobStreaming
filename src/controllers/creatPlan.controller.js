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

const get_All_plans = catchAsync(async(req,res) => {
  const userId = req.userId
  const data = await createPlanService.get_All_plans(userId)
  res.send(data)
})

const AdminSide_after_Employee_Payment = catchAsync(async (req, res) => {
  const data = await createPlanService.AdminSide_after_Employee_Payment()
  res.send({data});
})

module.exports = {
    createPlan,
    plan_view,
    updateById,
    get_All_plans,
    AdminSide_after_Employee_Payment,
};