const Attendance = require('../models/Attendance');

// Create attendance (bulk)
const createAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    console.log('📥 Create attendance:', attendanceRecords?.length || 0);
    
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({
        success: false,
        message: 'attendanceRecords must be an array'
      });
    }
    
    if (attendanceRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one attendance record is required'
      });
    }
    
    const createdRecords = await Attendance.insertMany(attendanceRecords);
    
    console.log(`✅ Created ${createdRecords.length} records`);
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      count: createdRecords.length,
      data: createdRecords
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate attendance entry'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create attendance'
    });
  }
};

// Get all attendance with filters
const getAllAttendance = async (req, res) => {
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
    
    console.log(`✅ Found ${attendance.length} records`);
    
    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('❌ Get error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance'
    });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findById(id)
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
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }
    
    console.log(`✅ Updated: ${id}`);
    
    res.json({
      success: true,
      message: 'Attendance updated',
      data: attendance
    });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete attendance
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findByIdAndDelete(id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }
    
    console.log(`🗑️ Deleted: ${id}`);
    
    res.json({
      success: true,
      message: 'Attendance deleted'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get today's attendance count
const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const count = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    console.log(`📊 Today: ${count}`);
    
    res.json({
      success: true,
      count,
      date: today.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Today error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CRITICAL: Correct export format
module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getTodayAttendance
};
