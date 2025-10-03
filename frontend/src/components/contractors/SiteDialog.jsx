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
import contractorService from '../../services/contractorService';
import { format } from 'date-fns';

const SiteDialog = ({ open, onClose, contractorId, site }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    siteName: '',
    address: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (site) {
      setFormData({
        siteName: site.siteName || '',
        address: site.address || '',
        description: site.description || '',
        startDate: site.startDate ? format(new Date(site.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      resetForm();
    }
  }, [site, open]);

  const resetForm = () => {
    setFormData({
      siteName: '',
      address: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.siteName.trim()) {
      setError('Site name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (site) {
        await contractorService.updateSite(contractorId, site._id, formData);
      } else {
        await contractorService.addSite(contractorId, formData);
      }

      onClose(true);
    } catch (err) {
      setError(err || 'Failed to save site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {site ? 'Edit Work Site' : 'Add New Work Site'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Name"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
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
            {loading ? 'Saving...' : site ? 'Update' : 'Add Site'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SiteDialog;
