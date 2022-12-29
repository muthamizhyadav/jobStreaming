const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const createPlanPaymentService = require('../services/planPaymentDetails.service');


const createPlanPayment = catchAsync(async (req, res) => {
    const userId = req.userId
  const user = await createPlanPaymentService.createPlanPayment(userId, req.body);
  res.status(httpStatus.CREATED).send({ user });
});

module.exports = {
    createPlanPayment,
};