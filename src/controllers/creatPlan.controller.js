const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createPlanService = require('../services/createPlan.service');


const createPlan = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await createPlanService.createPlan(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});

module.exports = {
    createPlan,
};