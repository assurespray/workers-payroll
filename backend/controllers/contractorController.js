const Contractor = require('../models/Contractor');

// @desc    Get all contractors
// @route   GET /api/contractors
// @access  Private
exports.getContractors = async (req, res) => {
  try {
    const { isActive = 'true' } = req.query;
    
    const contractors = await Contractor.find({ 
      isActive: isActive === 'true' 
    }).sort({ name: 1 });
    
    res.json({
      success: true,
      count: contractors.length,
      data: contractors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contractor
// @route   GET /api/contractors/:id
// @access  Private
exports.getContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    res.json({
      success: true,
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create contractor
// @route   POST /api/contractors
// @access  Private
exports.createContractor = async (req, res) => {
  try {
    const contractor = await Contractor.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Contractor created successfully',
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contractor
// @route   PUT /api/contractors/:id
// @access  Private
exports.updateContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, contactNumber: req.body.contactNumber },
      { new: true, runValidators: true }
    );
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contractor updated successfully',
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete contractor
// @route   DELETE /api/contractors/:id
// @access  Private
exports.deleteContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contractor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add site to contractor
// @route   POST /api/contractors/:id/sites
// @access  Private
exports.addSite = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    await contractor.addSite(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Site added successfully',
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update site
// @route   PUT /api/contractors/:id/sites/:siteId
// @access  Private
exports.updateSite = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    await contractor.updateSite(req.params.siteId, req.body);
    
    res.json({
      success: true,
      message: 'Site updated successfully',
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete site
// @route   DELETE /api/contractors/:id/sites/:siteId
// @access  Private
exports.deleteSite = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    await contractor.deleteSite(req.params.siteId);
    
    res.json({
      success: true,
      message: 'Site deleted successfully',
      data: contractor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get sites for contractor
// @route   GET /api/contractors/:id/sites
// @access  Private
exports.getSites = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    
    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found'
      });
    }
    
    const sites = contractor.getActiveSites();
    
    res.json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
