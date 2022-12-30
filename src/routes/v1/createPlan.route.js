const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const creatPlanController = require('../../controllers/creatPlan.controller');
const authorization = require('../../controllers/adminVerify.controller');
const _authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/').post(authorization, creatPlanController.createPlan);
router.route('/plan_view').get(authorization, creatPlanController.plan_view);
router.route('/plan_view_Update/:id').put(creatPlanController.updateById);
router.route('/get_All_plans').get(_authorization, creatPlanController.get_All_plans);
router.route('/AdminSide_after_Employee_Payment').get(creatPlanController.AdminSide_after_Employee_Payment);
module.exports = router;