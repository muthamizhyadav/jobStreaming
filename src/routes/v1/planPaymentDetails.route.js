const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const planPaymentDEtailsController = require('../../controllers/planPaymentDEtails.controller');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/').post(authorization, planPaymentDEtailsController.createPlanPayment);
router.route('/Plan_Deactivate/:id').put(planPaymentDEtailsController.Plan_Deactivate);
router.route('/employerPlanHistory').get(authorization, planPaymentDEtailsController.employerPlanHistory);
router.route('/cvCount/:candidateId').put(authorization, planPaymentDEtailsController.cvCount);
router.route('/cvdata').get(authorization, planPaymentDEtailsController.cvdata);
router.route('/cvdata_view/:id').get(planPaymentDEtailsController.cvdata_view);
module.exports = router;