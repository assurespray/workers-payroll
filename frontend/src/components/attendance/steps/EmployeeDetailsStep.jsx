import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import { SHIFT_TYPES } from '../../../utils/constants';

const EmployeeDetailsStep = ({ employees, attendanceRecords, onChange }) => {
  const handleEmployeeChange = (index, employeeId) => {
    const newRecords = [...attendanceRecords];
    newRecords[index] = { ...newRecords[index], employeeId };
    onChange(newRecords);
  };

  const handleShiftChange = (index, shiftType) => {
    const newRecords = [...attendanceRecords];
    newRecords[index] = { ...newRecords[index], shiftType };
    onChange(newRecords);
  };

  const handleRemarksChange = (index, remarks) => {
    const newRecords = [...attendanceRecords];
    newRecords[index] = { ...newRecords[index], remarks };
    onChange(newRecords);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 4: Worker Details
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Select employee and shift type for each worker
      </Typography>

      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {attendanceRecords.map((record, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Worker {index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Employee Name</InputLabel>
                  <Select
                    value={record.employeeId}
                    onChange={(e) => handleEmployeeChange(index, e.target.value)}
                    label="Employee Name"
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Shift Type</InputLabel>
                  <Select
                    value={record.shiftType}
                    onChange={(e) => handleShiftChange(index, e.target.value)}
                    label="Shift Type"
                  >
                    {SHIFT_TYPES.map((shift) => (
                      <MenuItem key={shift.value} value={shift.value}>
                        {shift.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Remarks (Optional)"
                  value={record.remarks}
                  onChange={(e) => handleRemarksChange(index, e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default EmployeeDetailsStep;
