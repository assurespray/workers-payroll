const express = require('express');
const {
  createAttendance,
  getAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getAttendance)
  .post(createAttendance);

router.route('/:id')
  .get(getSingleAttendance)
  .put(updateAttendance)
  .delete(deleteAttendance);

module.exports = router;
