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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import contractorService from '../../services/contractorService';
import reportService from '../../services/reportService';
import { format } from 'date-fns';
import { exportToExcel } from '../../utils/exportHelpers';

const ContractorReport = () => {
  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [sites, setSites] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    contractorId: '',
    siteId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchContractors();
    
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setFormData(prev => ({
      ...prev,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    }));
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await contractorService.getAll();
      setContractors(response.data || []);
    } catch (err) {
      console.error('Error loading contractors:', err);
    }
  };

  const handleContractorChange = (contractorId) => {
    const contractor = contractors.find(c => c._id === contractorId);
    setSites(contractor?.sites?.filter(s => s.isActive) || []);
    setFormData({ ...formData, contractorId, siteId: '' });
    setReportData(null);
  };

  const handleGenerateReport = async () => {
    if (!formData.contractorId || !formData.siteId || !formData.startDate || !formData.endDate) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await reportService.getContractorReport({
        contractorId: formData.contractorId,
        siteId: formData.siteId,
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

    const exportData = [];
    reportData.data.forEach(employeeGroup => {
      employeeGroup.records.forEach(record => {
        exportData.push({
          Date: format(new Date(record.date), 'MMM dd, yyyy'),
          'Employee Name': employeeGroup.employee.name,
          'Employee ID': employeeGroup.employee.employeeId,
          'Shift Type': record.shiftType.toUpperCase(),
          Remarks: record.remarks || '-',
        });
      });
    });

    const filename = `Contractor_Report_${reportData.contractor.name}_${format(new Date(), 'yyyyMMdd')}`;
    exportToExcel(exportData, filename, 'Contractor Report');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contractor Report
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
              <InputLabel>Contractor</InputLabel>
              <Select
                value={formData.contractorId}
                onChange={(e) => handleContractorChange(e.target.value)}
                label="Contractor"
              >
                {contractors.map((contractor) => (
                  <MenuItem key={contractor._id} value={contractor._id}>
                    {contractor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!formData.contractorId}>
              <InputLabel>Work Site</InputLabel>
              <Select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                label="Work Site"
              >
                {sites.map((site) => (
                  <MenuItem key={site._id} value={site._id}>
                    {site.siteName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6">
                {reportData.contractor.name} - {reportData.site.name}
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
            <Alert severity="info">No attendance records found for the selected criteria.</Alert>
          ) : (
            reportData.data.map((employeeGroup, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" justifyContent="space-between" width="100%" mr={2}>
                    <Typography>
                      {employeeGroup.employee.name} ({employeeGroup.employee.employeeId})
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Chip label={`Half: ${employeeGroup.summary.halfDays}`} size="small" />
                      <Chip label={`Full: ${employeeGroup.summary.fullDays}`} size="small" color="primary" />
                      <Chip label={`Double: ${employeeGroup.summary.doubleDays}`} size="small" color="secondary" />
                      <Chip 
                        label={`Total: ${employeeGroup.summary.totalEquivalentDays} days`} 
                        size="small" 
                        color="success"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Shift Type</strong></TableCell>
                          <TableCell><strong>Remarks</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeeGroup.records.map((record) => (
                          <TableRow key={record._id}>
                            <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <Chip label={record.shiftType.toUpperCase()} size="small" />
                            </TableCell>
                            <TableCell>{record.remarks || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ContractorReport;
