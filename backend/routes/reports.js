const express = require('express');
const {
  getContractorReport,
  getEmployeeReport,
  getAttendanceSummary
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/contractor', getContractorReport);
router.get('/employee', getEmployeeReport);
router.get('/summary', getAttendanceSummary);

module.exports = router;
