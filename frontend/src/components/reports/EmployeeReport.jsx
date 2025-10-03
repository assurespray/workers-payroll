import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import employeeService from '../../services/employeeService';
import reportService from '../../services/reportService';
import { format } from 'date-fns';
import { exportToExcel } from '../../utils/exportHelpers';

const EmployeeReport = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchEmployees();
    
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setFormData(prev => ({
      ...prev,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    }));
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const handleGenerateReport = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await reportService.getEmployeeReport({
        employeeId: formData.employeeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      setReportData(response);
    } catch (err) {
      setError(err || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!reportData || !reportData.data) return;

    const exportData = reportData.data.map(record => ({
      Date: format(new Date(record.date), 'MMM dd, yyyy'),
      'Contractor': record.contractorId?.name || '-',
      'Work Site': record.siteDetails?.siteName || '-',
      'Site Address': record.siteDetails?.address || '-',
      'Shift Type': record.shiftType.toUpperCase(),
      'Remarks': record.remarks || '-',
    }));

    const filename = `Employee_Report_${reportData.employee?.name}_${format(new Date(), 'yyyyMMdd')}`;
    exportToExcel(exportData, filename, 'Employee Report');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Report
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                label="Employee"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name} ({employee.employeeId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: '100%' }}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {reportData && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Half Days
                  </Typography>
                  <Typography variant="h4">{reportData.summary.halfDays}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Full Days
                  </Typography>
                  <Typography variant="h4">{reportData.summary.fullDays}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Double Shifts
                  </Typography>
                  <Typography variant="h4">{reportData.summary.doubleDays}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Equivalent Days
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {reportData.summary.totalEquivalentDays}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6">
                  {reportData.employee?.name} ({reportData.employee?.employeeId})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {format(new Date(formData.startDate), 'MMM dd, yyyy')} - {format(new Date(formData.endDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
              >
                Export to Excel
              </Button>
            </Box>

            {reportData.data.length === 0 ? (
              <Alert severity="info">No attendance records found for the selected period.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Contractor</strong></TableCell>
                      <TableCell><strong>Work Site</strong></TableCell>
                      <TableCell><strong>Shift Type</strong></TableCell>
                      <TableCell><strong>Remarks</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.data.map((record) => (
                      <TableRow key={record._id} hover>
                        <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{record.contractorId?.name || '-'}</TableCell>
                        <TableCell>
                          {record.siteDetails?.siteName || '-'}
                          {record.siteDetails?.address && (
                            <Typography variant="caption" display="block" color="textSecondary">
                              {record.siteDetails.address}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={record.shiftType.toUpperCase()} size="small" />
                        </TableCell>
                        <TableCell>{record.remarks || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default EmployeeReport;
