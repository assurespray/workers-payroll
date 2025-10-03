import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import employeeService from '../../services/employeeService';
import EmployeeDialog from './EmployeeDialog';

const EmployeeDetailDialog = ({ open, onClose, employee }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!employee) return null;

  const handleEdit = () => {
    setOpenEditDialog(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        await employeeService.delete(employee._id);
        onClose(true);
      } catch (err) {
        setError(err || 'Failed to delete employee');
      } finally {
        setLoading(false);
      }
    }
  };

  const DetailRow = ({ label, value }) => (
    <Box mb={2}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || '-'}</Typography>
    </Box>
  );

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Employee Details</Typography>
            <Box>
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" disabled={loading}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailRow label="Employee ID" value={employee.employeeId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Name" value={employee.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Phone Number" value={employee.phoneNumber} />
            </Grid>
            <Grid item xs={12}>
              <DetailRow label="Aadhar Number" value={employee.aadharMasked} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Bank Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <DetailRow
                label="Account Number"
                value={employee.bankDetails?.accountNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="IFSC Code" value={employee.bankDetails?.ifscCode} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailRow label="Bank Name" value={employee.bankDetails?.bankName} />
            </Grid>
            <Grid item xs={12}>
              <DetailRow label="Branch" value={employee.bankDetails?.branch} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <EmployeeDialog
        open={openEditDialog}
        onClose={(refresh) => {
          setOpenEditDialog(false);
          if (refresh) {
            onClose(true);
          }
        }}
        employee={employee}
      />
    </>
  );
};

export default EmployeeDetailDialog;
