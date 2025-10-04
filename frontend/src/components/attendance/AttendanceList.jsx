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
import { Search as SearchIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import attendanceService from '../../services/attendanceService';
import { format } from 'date-fns';
import { SHIFT_COLORS } from '../../utils/constants';

const AttendanceList = () => {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    initializeDates();
  }, []);

  const initializeDates = () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');
      
      setStartDate(startStr);
      setEndDate(endStr);
      
      // Auto-fetch
      fetchAttendance(startStr, endStr);
    } catch (err) {
      console.error('Date init error:', err);
      setError('Failed to initialize dates');
    }
  };

  const fetchAttendance = async (start, end) => {
    setLoading(true);
    setError('');
  
    try {
      console.log('Fetching attendance:', { start, end });
    
      const result = await attendanceService.getAll({
        startDate: start,
        endDate: end,
        limit: 500,
      });
    
      console.log('Fetch result:', result);
    
      // Handle response safely
      if (result && result.data && Array.isArray(result.data)) {
        setAttendance(result.data);
        console.log(`Loaded ${result.data.length} records`);
      } else {
        setAttendance([]);
        console.log('No data in response');
      }
    
      if (result.message && !result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(typeof err === 'string' ? err : 'Failed to load attendance');
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    fetchAttendance(startDate, endDate);
  };

  const handleRefresh = () => {
    if (startDate && endDate) {
      fetchAttendance(startDate, endDate);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;

    try {
      await attendanceService.delete(id);
      setAttendance(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to delete');
    }
  };

  const getShiftColor = (type) => {
    if (!type) return '#757575';
    return SHIFT_COLORS[type.toLowerCase()] || '#757575';
  };

  const getShiftLabel = (type) => {
    if (!type) return 'N/A';
    const labels = {
      half: 'HALF DAY',
      full: 'FULL DAY',
      onehalf: 'ONE & HALF',
      double: 'DOUBLE'
    };
    return labels[type.toLowerCase()] || type.toUpperCase();
  };

  const safeDate = (dateValue) => {
    try {
      return dateValue ? format(new Date(dateValue), 'MMM dd, yyyy') : 'N/A';
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Attendance Records
        </Typography>
        <IconButton onClick={handleRefresh} disabled={loading} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
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
              disabled={loading}
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
              disabled={loading}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : !Array.isArray(attendance) || attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No attendance records found for the selected date range
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Try selecting a different date range or add attendance records first
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((record) => (
                <TableRow key={record._id} hover>
                  <TableCell>{safeDate(record.date)}</TableCell>
                  <TableCell>
                    {record.employeeId?.name || 'Unknown'}
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      {record.employeeId?.employeeId || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{record.contractorId?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getShiftLabel(record.shiftType)}
                      size="small"
                      sx={{ bgcolor: getShiftColor(record.shiftType), color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>{record.remarks || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(record._id)}
                      disabled={loading}
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
          Total Records: {Array.isArray(attendance) ? attendance.length : 0}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttendanceList;
    
