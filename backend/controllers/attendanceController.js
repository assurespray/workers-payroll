const Attendance = require('../models/Attendance');

// Create attendance (bulk)
exports.createAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    console.log('📥 Create attendance request:', {
      recordCount: attendanceRecords?.length || 0
    });
    
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
    
    // Insert all records
    const createdRecords = await Attendance.insertMany(attendanceRecords);
    
    console.log(`✅ Created ${createdRecords.length} attendance records`);
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      count: createdRecords.length,
      data: createdRecords
    });
  } catch (error) {
    console.error('❌ Create attendance error:', error);
    
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
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, contractorId, siteId, limit = 100 } = req.query;
    
    console.log('📥 Get attendance:', { startDate, endDate, limit });
    
    const query = {};
    
    // Date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Other filters
    if (employeeId) query.employeeId = employeeId;
    if (contractorId) query.contractorId = contractorId;
    if (siteId) query.siteId = siteId;
    
    // Execute query
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
    console.error('❌ Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance'
    });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findById(id)
      .populate('employeeId')
      .populate('contractorId');
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('❌ Get attendance by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
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
        message: 'Attendance record not found'
      });
    }
    
    console.log(`✅ Updated attendance: ${id}`);
    
    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    console.error('❌ Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findByIdAndDelete(id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    console.log(`🗑️ Deleted attendance: ${id}`);
    
    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get today's attendance count
exports.getTodayAttendance = async (req, res) => {
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
    
    console.log(`📊 Today's attendance: ${count}`);
    
    res.json({
      success: true,
      count,
      date: today.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Today attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
  
