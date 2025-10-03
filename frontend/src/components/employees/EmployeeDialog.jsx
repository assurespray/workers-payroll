import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import employeeService from '../../services/employeeService';

const EmployeeDialog = ({ open, onClose, employee }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    aadharNumber: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: '',
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        phoneNumber: employee.phoneNumber || '',
        aadharNumber: '',
        bankDetails: employee.bankDetails || {
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          branch: '',
        },
      });
    } else {
      resetForm();
    }
  }, [employee, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      aadharNumber: '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: '',
      },
    });
    setErrors({});
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Name is required
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone is OPTIONAL - only validate if provided
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      }
    }

    // Aadhar is OPTIONAL - only validate if provided
    if (!employee && formData.aadharNumber && formData.aadharNumber.trim()) {
      if (!/^[0-9]{12}$/.test(formData.aadharNumber)) {
        newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';
      }
    }

    // IFSC is optional - only validate if provided
    if (formData.bankDetails.ifscCode && formData.bankDetails.ifscCode.trim()) {
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
        newErrors.ifscCode = 'Invalid IFSC code format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Clean up empty strings to null for optional fields
      const cleanedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        aadharNumber: formData.aadharNumber.trim() || undefined,
        bankDetails: {
          accountNumber: formData.bankDetails.accountNumber.trim() || undefined,
          ifscCode: formData.bankDetails.ifscCode.trim() || undefined,
          bankName: formData.bankDetails.bankName.trim() || undefined,
          branch: formData.bankDetails.branch.trim() || undefined,
        }
      };

      if (employee) {
        await employeeService.update(employee._id, cleanedData);
      } else {
        await employeeService.create(cleanedData);
      }

      onClose(true);
    } catch (err) {
      setError(err || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber || '10 digits'}
                disabled={loading}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            {!employee && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Aadhar Number (Optional)"
                  value={formData.aadharNumber}
                  onChange={(e) => handleChange('aadharNumber', e.target.value)}
                  error={!!errors.aadharNumber}
                  helperText={errors.aadharNumber || '12 digits (will be encrypted)'}
                  disabled={loading}
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Account Number (Optional)"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleChange('bankDetails.accountNumber', e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IFSC Code (Optional)"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleChange('bankDetails.ifscCode', e.target.value.toUpperCase())}
                error={!!errors.ifscCode}
                helperText={errors.ifscCode}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name (Optional)"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleChange('bankDetails.bankName', e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch (Optional)"
                value={formData.bankDetails.branch}
                onChange={(e) => handleChange('bankDetails.branch', e.target.value)}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : employee ? 'Update' : 'Add Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeDialog;
