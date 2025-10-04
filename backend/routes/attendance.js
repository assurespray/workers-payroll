const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST /api/attendance - Create attendance
router.post('/', async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    console.log('📥 Create attendance request:', attendanceRecords?.length || 0);
    
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Attendance records array is required'
      });
    }
    
    const created = await Attendance.insertMany(attendanceRecords);
    
    console.log('✅ Created', created.length, 'attendance records');
    
    res.status(201).json({
      success: true,
      count: created.length,
      data: created,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error('❌ Create attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create attendance'
    });
  }
});

// GET /api/attendance - Get all attendance
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, employeeId, contractorId, siteId, limit = 100 } = req.query;
    
    console.log('📥 Get attendance:', { startDate, endDate, limit });
    
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (employeeId) query.employeeId = employeeId;
    if (contractorId) query.contractorId = contractorId;
    if (siteId) query.siteId = siteId;
    
    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name employeeId')
      .populate('contractorId', 'name contractorId')
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    console.log('✅ Found', attendance.length, 'attendance records');
    
    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('❌ Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance'
    });
  }
});

// GET /api/attendance/:id - Get single attendance
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employeeId')
      .populate('contractorId');
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }
    
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('❌ Get by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/attendance/:id - Update attendance
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }
    
    console.log('✅ Updated attendance:', req.params.id);
    
    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/attendance/:id - Delete attendance
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }
    
    console.log('🗑️ Deleted attendance:', req.params.id);
    
    res.json({
      success: true,
      message: 'Attendance deleted successfully'
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
