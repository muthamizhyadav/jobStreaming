const express = require('express');
const router = express.Router();
const DummyController = require('../../controllers/DummyController');

router.route('/').post(DummyController.createDummy);

module.exports = router;
