const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getTodayAttendance
} = require('../controllers/attendanceController');

// All routes require authentication
router.use(protect);

// POST /api/attendance - Create attendance (bulk)
router.post('/', createAttendance);

// GET /api/attendance - Get all attendance with filters
router.get('/', getAllAttendance);

// GET /api/attendance/today - Get today's attendance count
router.get('/today', getTodayAttendance);

// GET /api/attendance/:id - Get attendance by ID
router.get('/:id', getAttendanceById);

// PUT /api/attendance/:id - Update attendance
router.put('/:id', updateAttendance);

// DELETE /api/attendance/:id - Delete attendance
router.delete('/:id', deleteAttendance);

module.exports = router;
