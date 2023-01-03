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

const cvCount = catchAsync(async(req,res) => {
  const userId = req.userId
  const user = await createPlanPaymentService.cvCount(req.params.candidateId, userId)
  res.send(user)
})


const cvdata = catchAsync(async(req,res) => {
  const userId = req.userId
  const user = await createPlanPaymentService.cvdata(userId)
  res.send(user)
})

const cvdata_view = catchAsync(async(req,res) => {
  const user = await createPlanPaymentService.cvdata_view(req.params.id)
  res.send(user)
})

module.exports = {
    createPlanPayment,
    Plan_Deactivate,
    employerPlanHistory,
    cvCount,
    cvdata,
    cvdata_view,
};