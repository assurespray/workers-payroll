const Attendance = require('../models/Attendance');
const Contractor = require('../models/Contractor');

// @desc    Get contractor report
// @route   GET /api/reports/contractor
// @access  Private
exports.getContractorReport = async (req, res) => {
  try {
    const { contractorId, siteId, startDate, endDate } = req.query;
    
    if (!contractorId || !siteId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Contractor ID, Site ID, Start Date and End Date are required'
      });
    }
    
    // Get contractor details
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    // Find the site
    const site = contractor.sites.id(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }
    
    // Get report data
    const reportData = await Attendance.getContractorReport(
      contractorId,
      siteId,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      contractor: {
        id: contractor._id,
        name: contractor.name,
        contractorId: contractor.contractorId
      },
      site: {
        id: site._id,
        name: site.siteName,
        address: site.address
      },
      dateRange: {
        startDate,
        endDate
      },
      data: reportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employee report
// @route   GET /api/reports/employee
// @access  Private
exports.getEmployeeReport = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, Start Date and End Date are required'
      });
    }
    
    // Get employee summary
    const result = await Attendance.getEmployeeSummary(
      employeeId,
      startDate,
      endDate
    );
    
    // Populate contractor and site details for each record
    await Attendance.populate(result.records, [
      { path: 'employeeId', select: 'employeeId name phoneNumber' },
      { path: 'contractorId', select: 'contractorId name' }
    ]);
    
    // Add site details from contractor
    const recordsWithSiteDetails = await Promise.all(
      result.records.map(async (record) => {
        const contractor = await Contractor.findById(record.contractorId._id);
        const site = contractor ? contractor.sites.id(record.siteId) : null;
        
        return {
          ...record.toObject(),
          siteDetails: site ? {
            siteName: site.siteName,
            address: site.address
          } : null
        };
      })
    );
    
    res.json({
      success: true,
      employee: result.records[0]?.employeeId || null,
      dateRange: {
        startDate,
        endDate
      },
      summary: result.summary,
      data: recordsWithSiteDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance summary by date range
// @route   GET /api/reports/summary
// @access  Private
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start Date and End Date are required'
      });
    }
    
    const attendance = await Attendance.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('employeeId contractorId');
    
    // Calculate summary
    const summary = {
      totalRecords: attendance.length,
      uniqueEmployees: new Set(attendance.map(a => a.employeeId._id.toString())).size,
      uniqueContractors: new Set(attendance.map(a => a.contractorId._id.toString())).size,
      shiftBreakdown: {
        half: 0,
        full: 0,
        double: 0
      },
      totalEquivalentDays: 0
    };
    
    attendance.forEach(record => {
      summary.shiftBreakdown[record.shiftType]++;
      summary.totalEquivalentDays += 
        record.shiftType === 'half' ? 0.5 :
        record.shiftType === 'full' ? 1.0 : 2.0;
    });
    
    res.json({
      success: true,
      dateRange: { startDate, endDate },
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
