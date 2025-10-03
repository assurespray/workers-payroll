const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const contractorSchema = new mongoose.Schema({
  contractorId: {
    type: String,
    required: [true, 'Contractor ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Contractor name is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{10}$/.test(v);
      },
      message: 'Contact number must be exactly 10 digits'
    }
  },
  sites: [siteSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate contractor ID automatically
contractorSchema.pre('save', async function(next) {
  if (!this.contractorId) {
    try {
      const count = await this.constructor.countDocuments();
      const year = new Date().getFullYear().toString().slice(-2);
      this.contractorId = `CON${year}${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual for active sites count
contractorSchema.virtual('activeSitesCount').get(function() {
  return this.sites.filter(site => site.isActive).length;
});

// Method to add site
contractorSchema.methods.addSite = function(siteData) {
  this.sites.push(siteData);
  return this.save();
};

// Method to update site
contractorSchema.methods.updateSite = function(siteId, siteData) {
  const site = this.sites.id(siteId);
  if (site) {
    Object.assign(site, siteData);
    return this.save();
  }
  throw new Error('Site not found');
};

// Method to delete site (soft delete)
contractorSchema.methods.deleteSite = function(siteId) {
  const site = this.sites.id(siteId);
  if (site) {
    site.isActive = false;
    return this.save();
  }
  throw new Error('Site not found');
};

// Method to get active sites
contractorSchema.methods.getActiveSites = function() {
  return this.sites.filter(site => site.isActive);
};

// Indexes
contractorSchema.index({ contractorId: 1 });
contractorSchema.index({ name: 1 });
contractorSchema.index({ isActive: 1 });
contractorSchema.index({ 'sites._id': 1 });

module.exports = mongoose.model('Contractor', contractorSchema);
