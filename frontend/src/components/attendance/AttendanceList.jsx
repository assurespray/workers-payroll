import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import attendanceService from '../../services/attendanceService';
import { format } from 'date-fns';
import { SHIFT_COLORS } from '../../utils/constants';

const AttendanceList = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    const startDateStr = format(start, 'yyyy-MM-dd');
    const endDateStr = format(end, 'yyyy-MM-dd');
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    
    fetchAttendance(startDateStr, endDateStr);
  }, []);

  const fetchAttendance = async (start, end) => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceService.getAll({
        startDate: start,
        endDate: end,
        limit: 500,
      });
      
      // Ensure data is always an array
      setAttendance(response?.data || []);
    } catch (err) {
      setError(err || 'Failed to load attendance');
      setAttendance([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchAttendance(startDate, endDate);
    } else {
      setError('Please select both start and end dates');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceService.delete(id);
        setAttendance(attendance.filter(record => record._id !== id));
      } catch (err) {
        setError(err || 'Failed to delete attendance');
      }
    }
  };

  const getShiftColor = (shiftType) => {
    return SHIFT_COLORS[shiftType] || '#757575';
  };

  const getShiftLabel = (shiftType) => {
    const labels = {
      half: 'HALF DAY',
      full: 'FULL DAY',
      onehalf: 'ONE & HALF',
      double: 'DOUBLE'
    };
    return labels[shiftType] || shiftType?.toUpperCase();
  };

  if (loading && attendance.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance Records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              fullWidth
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Contractor</strong></TableCell>
              <TableCell><strong>Shift Type</strong></TableCell>
              <TableCell><strong>Remarks</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!attendance || attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'No attendance records found for the selected date range.'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((record) => (
                <TableRow key={record._id} hover>
                  <TableCell>
                    {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {record.employeeId?.name || '-'}
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      {record.employeeId?.employeeId || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {record.contractorId?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getShiftLabel(record.shiftType)}
                      size="small"
                      sx={{
                        bgcolor: getShiftColor(record.shiftType),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>{record.remarks || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(record._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Total Records: {attendance?.length || 0}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttendanceList;
            
