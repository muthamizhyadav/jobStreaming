const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const planPaymentDEtailsController = require('../../controllers/planPaymentDEtails.controller');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/').post(authorization, planPaymentDEtailsController.createPlanPayment);
router.route('/Plan_Deactivate/:id').put(planPaymentDEtailsController.Plan_Deactivate);
router.route('/employerPlanHistory').get(authorization, planPaymentDEtailsController.employerPlanHistory);

module.exports = router;