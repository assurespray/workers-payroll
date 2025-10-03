const express = require('express');
const PayrollSettings = require('../models/PayrollSettings');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// @desc    Get payroll settings
// @route   GET /api/payroll/settings
// @access  Private
router.get('/settings', async (req, res) => {
  try {
    const settings = await PayrollSettings.getActiveSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update payroll settings
// @route   PUT /api/payroll/settings/:id
// @access  Private (Admin)
router.put('/settings/:id', async (req, res) => {
  try {
    const settings = await PayrollSettings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Payroll settings not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Payroll settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Calculate payroll for employee
// @route   GET /api/payroll/calculate/:employeeId
// @access  Private
router.get('/calculate/:employeeId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    // Get attendance summary
    const result = await Attendance.getEmployeeSummary(
      req.params.employeeId,
      startDate,
      endDate
    );
    
    // Get payroll settings
    const settings = await PayrollSettings.getActiveSettings();
    
    // Calculate payroll
    const payrollCalculation = settings.calculatePayroll(result.summary);
    
    res.json({
      success: true,
      employeeId: req.params.employeeId,
      dateRange: { startDate, endDate },
      attendanceSummary: result.summary,
      payrollCalculation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
