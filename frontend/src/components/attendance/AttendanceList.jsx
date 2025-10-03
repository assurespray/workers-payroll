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
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Initialize dates safely
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      
      const startDateStr = format(start, 'yyyy-MM-dd');
      const endDateStr = format(end, 'yyyy-MM-dd');
      
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      
      // Auto-fetch on mount
      fetchAttendance(startDateStr, endDateStr);
    } catch (err) {
      console.error('Date initialization error:', err);
      setError('Failed to initialize date range');
    }
  }, []);

  const fetchAttendance = async (start, end) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📥 Fetching attendance:', { start, end });
      
      const response = await attendanceService.getAll({
        startDate: start,
        endDate: end,
        limit: 500,
      });
      
      console.log('📨 Response:', response);
      
      // Safely handle response
      if (response && response.data) {
        const records = Array.isArray(response.data) ? response.data : [];
        setAttendance(records);
        console.log(`✅ Loaded ${records.length} attendance records`);
      } else {
        setAttendance([]);
        console.log('ℹ️ No data in response');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err?.message || err || 'Failed to load attendance records');
      setAttendance([]); // Always set to empty array on error
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
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      await attendanceService.delete(id);
      
      // Remove from local state
      setAttendance(prev => prev.filter(record => record._id !== id));
      
      console.log('✅ Attendance deleted');
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError(err?.message || err || 'Failed to delete attendance');
    }
  };

  const getShiftColor = (shiftType) => {
    if (!shiftType) return '#757575';
    return SHIFT_COLORS[shiftType.toLowerCase()] || '#757575';
  };

  const getShiftLabel = (shiftType) => {
    if (!shiftType) return 'N/A';
    
    const labels = {
      half: 'HALF DAY',
      full: 'FULL DAY',
      onehalf: 'ONE & HALF',
      double: 'DOUBLE'
    };
    
    return labels[shiftType.toLowerCase()] || shiftType.toUpperCase();
  };

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
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading attendance records...
                  </Typography>
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
              attendance.map((record) => {
                // Safe data access with fallbacks
                const employeeName = record?.employeeId?.name || 'Unknown';
                const employeeCode = record?.employeeId?.employeeId || 'N/A';
                const contractorName = record?.contractorId?.name || 'Unknown';
                const recordDate = record?.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A';
                const shiftType = record?.shiftType || 'N/A';
                const remarks = record?.remarks || '-';
                
                return (
                  <TableRow key={record._id} hover>
                    <TableCell>{recordDate}</TableCell>
                    <TableCell>
                      {employeeName}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {employeeCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{contractorName}</TableCell>
                    <TableCell>
                      <Chip
                        label={getShiftLabel(shiftType)}
                        size="small"
                        sx={{
                          bgcolor: getShiftColor(shiftType),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>{remarks}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(record._id)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
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
        
