const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: false,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    validate: {
      validator: function(v) {
        // Validate decrypted value
        try {
          const decrypted = this.decryptAadhar(v);
          return /^[0-9]{12}$/.test(decrypted);
        } catch {
          return /^[0-9]{12}$/.test(v);
        }
      },
      message: 'Aadhar number must be exactly 12 digits'
    }
  },
  bankDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    bankName: {
      type: String,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt Aadhar before saving
employeeSchema.pre('save', function(next) {
  if (this.isModified('aadharNumber') && this.aadharNumber) {
    try {
      // Only encrypt if not already encrypted
      if (/^[0-9]{12}$/.test(this.aadharNumber)) {
        const encrypted = CryptoJS.AES.encrypt(
          this.aadharNumber,
          process.env.AADHAR_ENCRYPTION_KEY
        ).toString();
        this.aadharNumber = encrypted;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Generate employee ID automatically
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    try {
      const count = await this.constructor.countDocuments();
      const year = new Date().getFullYear().toString().slice(-2);
      this.employeeId = `EMP${year}${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to decrypt Aadhar
employeeSchema.methods.decryptAadhar = function(encrypted) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encrypted || this.aadharNumber,
      process.env.AADHAR_ENCRYPTION_KEY
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

// Method to get masked Aadhar (XXXX-XXXX-1234)
employeeSchema.methods.getMaskedAadhar = function() {
  try {
    const decrypted = this.decryptAadhar();
    if (decrypted && decrypted.length === 12) {
      return `XXXX-XXXX-${decrypted.slice(-4)}`;
    }
    return 'XXXX-XXXX-XXXX';
  } catch {
    return 'XXXX-XXXX-XXXX';
  }
};

// Virtual to get full Aadhar (for authorized access)
employeeSchema.virtual('aadharDecrypted').get(function() {
  return this.decryptAadhar();
});

// Indexes
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ name: 1 });
employeeSchema.index({ phoneNumber: 1 });
employeeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
