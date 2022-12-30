const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createPlanPaymentService = require('../services/planPaymentDetails.service');


const createPlanPayment = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await createPlanPaymentService.createPlanPayment(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});


const Plan_Deactivate = catchAsync(async(req,res) => {
  const user = await createPlanPaymentService.Plan_Deactivate(req.params.id, req.body)
  res.send({user})
})

const employerPlanHistory = catchAsync(async(req,res) => {
  const userId = req.userId
  const user = await createPlanPaymentService.employerPlanHistory(userId)
  res.send(user)
})

module.exports = {
    createPlanPayment,
    Plan_Deactivate,
    employerPlanHistory,
};