import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import contractorService from '../../services/contractorService';

const ContractorDialog = ({ open, onClose, contractor }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
  });

  useEffect(() => {
    if (contractor) {
      setFormData({
        name: contractor.name || '',
        contactNumber: contractor.contactNumber || '',
      });
    } else {
      resetForm();
    }
  }, [contractor, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      contactNumber: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Contractor name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (contractor) {
        await contractorService.update(contractor._id, formData);
      } else {
        await contractorService.create(formData);
      }

      onClose(true);
    } catch (err) {
      setError(err || 'Failed to save contractor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {contractor ? 'Edit Contractor' : 'Add New Contractor'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Contractor Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            disabled={loading}
            inputProps={{ maxLength: 10 }}
          />
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
            {loading ? 'Saving...' : contractor ? 'Update' : 'Add Contractor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContractorDialog;
