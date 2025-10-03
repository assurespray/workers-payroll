const mongoose = require('mongoose');

const payrollSettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Default Payroll Settings'
  },
  rates: {
    halfDay: {
      type: Number,
      required: [true, 'Half day rate is required'],
      min: [0, 'Rate cannot be negative'],
      default: 250
    },
    fullDay: {
      type: Number,
      required: [true, 'Full day rate is required'],
      min: [0, 'Rate cannot be negative'],
      default: 500
    },
    doubleShift: {
      type: Number,
      required: [true, 'Double shift rate is required'],
      min: [0, 'Rate cannot be negative'],
      default: 1000
    }
  },
  deductions: {
    pf: {
      type: Number,
      min: [0, 'PF cannot be negative'],
      default: 0
    },
    esi: {
      type: Number,
      min: [0, 'ESI cannot be negative'],
      default: 0
    },
    advance: {
      type: Number,
      min: [0, 'Advance cannot be negative'],
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get active settings
payrollSettingsSchema.statics.getActiveSettings = async function() {
  let settings = await this.findOne({ isActive: true });
  
  // Create default if none exists
  if (!settings) {
    settings = await this.create({
      name: 'Default Payroll Settings',
      isActive: true
    });
  }
  
  return settings;
};

// Method to calculate payroll for employee
payrollSettingsSchema.methods.calculatePayroll = function(attendanceSummary) {
  const { halfDays = 0, fullDays = 0, doubleDays = 0 } = attendanceSummary;
  
  const earnings = {
    halfDayAmount: halfDays * this.rates.halfDay,
    fullDayAmount: fullDays * this.rates.fullDay,
    doubleShiftAmount: doubleDays * this.rates.doubleShift
  };
  
  const grossAmount = 
    earnings.halfDayAmount + 
    earnings.fullDayAmount + 
    earnings.doubleShiftAmount;
  
  const deductions = {
    pf: this.deductions.pf,
    esi: this.deductions.esi,
    advance: this.deductions.advance
  };
  
  const totalDeductions = 
    deductions.pf + 
    deductions.esi + 
    deductions.advance;
  
  const netAmount = grossAmount - totalDeductions;
  
  return {
    earnings,
    grossAmount,
    deductions,
    totalDeductions,
    netAmount,
    breakdown: {
      halfDays,
      fullDays,
      doubleDays,
      totalEquivalentDays: (halfDays * 0.5) + fullDays + (doubleDays * 2)
    }
  };
};

module.exports = mongoose.model('PayrollSettings', payrollSettingsSchema);
