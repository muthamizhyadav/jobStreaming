const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../controllers/auth.controller');
const employerDetailsController = require('../../controllers/employerDetails.controller');
const authorization = require('../../controllers/empVEridy.controller');

const router = express.Router();

router.route('/createEmpDetails').post(authorization, employerDetailsController.createEmpDetails);

router.route('/getEmpDetails').get(authorization,employerDetailsController.getByIdUser);
router.route('/updateEmpDetails/:id').put(employerDetailsController.updateById);
router.route('/deleteEmpDetails/:id').delete(employerDetailsController.deleteById);
router.route('/createEmpDetailsRepost/:id').put(employerDetailsController.createEmpDetailsRepost);
router.route('/getByIdEmpDetails/:id').get(employerDetailsController.getById_Get);
router.route('/data_Id/:id').get(employerDetailsController.data_Id);
router.route('/countPostjobError').get(authorization, employerDetailsController.countPostjobError);
module.exports = router;