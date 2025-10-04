const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Import protect middleware
const protect = require('../middleware/auth').protect;

// POST /api/attendance - Create attendance
router.post('/', protect, async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    console.log('📥 Create attendance:', attendanceRecords?.length || 0);
    
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Attendance records array is required'
      });
    }
    
    const created = await Attendance.insertMany(attendanceRecords);
    
    console.log('✅ Created', created.length, 'records');
    
    res.status(201).json({
      success: true,
      count: created.length,
      data: created
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/attendance - Get all attendance
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    
    console.log('📥 Get attendance:', { startDate, endDate });
    
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name employeeId')
      .populate('contractorId', 'name contractorId')
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    console.log('✅ Found', attendance.length, 'records');
    
    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('❌ Get error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/attendance/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }
    
    console.log('🗑️ Deleted:', req.params.id);
    
    res.json({
      success: true,
      message: 'Deleted'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
