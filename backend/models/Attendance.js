const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: [true, 'Contractor ID is required']
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Site ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  shiftType: {
    type: String,
    enum: ['half', 'full', 'onehalf', 'double'],
    required: [true, 'Shift type is required'],
    lowercase: true
  },
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual to get shift value for calculations
attendanceSchema.virtual('shiftValue').get(function() {
  const shiftValues = {
    half: 0.5,
    full: 1.0,
    double: 2.0
  };
  return shiftValues[this.shiftType] || 0;
});

// Static method to get attendance by contractor and site
attendanceSchema.statics.getByContractorAndSite = async function(contractorId, siteId, startDate, endDate) {
  const query = {
    contractorId,
    siteId
  };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return await this.find(query)
    .populate('employeeId', 'employeeId name phoneNumber')
    .sort({ date: -1 });
};

// Static method to get attendance by employee
attendanceSchema.statics.getByEmployee = async function(employeeId, startDate, endDate) {
  const query = { employeeId };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return await this.find(query)
    .populate('contractorId', 'contractorId name')
    .sort({ date: -1 });
};

// Static method to get attendance summary for employee
attendanceSchema.statics.getEmployeeSummary = async function(employeeId, startDate, endDate) {
  const records = await this.getByEmployee(employeeId, startDate, endDate);
  
  const summary = {
    totalRecords: records.length,
    halfDays: 0,
    fullDays: 0,
    doubleDays: 0,
    totalEquivalentDays: 0
  };
  
  records.forEach(record => {
    switch(record.shiftType) {
      case 'half':
        summary.halfDays++;
        summary.totalEquivalentDays += 0.5;
        break;
      case 'full':
        summary.fullDays++;
        summary.totalEquivalentDays += 1.0;
        break;
      case 'double':
        summary.doubleDays++;
        summary.totalEquivalentDays += 2.0;
        break;
    }
  });
  
  return {
    summary,
    records
  };
};

// Static method to get contractor report with employee grouping
attendanceSchema.statics.getContractorReport = async function(contractorId, siteId, startDate, endDate) {
  const records = await this.getByContractorAndSite(contractorId, siteId, startDate, endDate);
  
  // Group by employee
  const employeeMap = {};
  
  records.forEach(record => {
    const empId = record.employeeId._id.toString();
    
    if (!employeeMap[empId]) {
      employeeMap[empId] = {
        employee: record.employeeId,
        records: [],
        summary: {
          halfDays: 0,
          fullDays: 0,
          doubleDays: 0,
          totalEquivalentDays: 0
        }
      };
    }
    
    employeeMap[empId].records.push(record);
    
    // Update summary
    switch(record.shiftType) {
      case 'half':
        employeeMap[empId].summary.halfDays++;
        employeeMap[empId].summary.totalEquivalentDays += 0.5;
        break;
      case 'full':
        employeeMap[empId].summary.fullDays++;
        employeeMap[empId].summary.totalEquivalentDays += 1.0;
        break;
      case 'double':
        employeeMap[empId].summary.doubleDays++;
        employeeMap[empId].summary.totalEquivalentDays += 2.0;
        break;
    }
  });
  
  return Object.values(employeeMap);
};

// Indexes
attendanceSchema.index({ employeeId: 1, date: -1 });
attendanceSchema.index({ contractorId: 1, siteId: 1, date: -1 });
attendanceSchema.index({ date: -1 });

// Compound index for unique constraint (one entry per employee per day per site)
attendanceSchema.index(
  { employeeId: 1, contractorId: 1, siteId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
