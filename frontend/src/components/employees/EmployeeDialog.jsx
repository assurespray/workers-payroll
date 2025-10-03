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
import { validators } from '../../utils/validators';

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

    const nameError = validators.required(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const phoneError = validators.phone(formData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    if (!employee) {
      const aadharError = validators.aadhar(formData.aadharNumber);
      if (aadharError) newErrors.aadharNumber = aadharError;
    }

    if (formData.bankDetails.ifscCode) {
      const ifscError = validators.ifsc(formData.bankDetails.ifscCode);
      if (ifscError) newErrors.ifscCode = ifscError;
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

      if (employee) {
        await employeeService.update(employee._id, formData);
      } else {
        await employeeService.create(formData);
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
                required={false}
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                disabled={loading}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            {!employee && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Aadhar Number (Optional)"
                  required={false}
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
                label="Bank Account Number"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleChange('bankDetails.accountNumber', e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IFSC Code"
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
                label="Bank Name"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleChange('bankDetails.bankName', e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch"
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
