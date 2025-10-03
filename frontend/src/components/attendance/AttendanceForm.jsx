import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import contractorService from '../../services/contractorService';
import employeeService from '../../services/employeeService';
import attendanceService from '../../services/attendanceService';
import ContractorStep from './steps/ContractorStep';
import SiteStep from './steps/SiteStep';
import EmployeeCountStep from './steps/EmployeeCountStep';
import EmployeeDetailsStep from './steps/EmployeeDetailsStep';
import DateStep from './steps/DateStep';
import { format } from 'date-fns';

const steps = ['Select Contractor', 'Select Site', 'Number of Workers', 'Worker Details', 'Select Date'];

const AttendanceForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [contractors, setContractors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sites, setSites] = useState([]);
  
  const [formData, setFormData] = useState({
    contractorId: '',
    siteId: '',
    employeeCount: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    attendanceRecords: [],
  });

  useEffect(() => {
    fetchContractors();
    fetchEmployees();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await contractorService.getAll();
      setContractors(response.data || []);
    } catch (err) {
      setError('Failed to load contractors');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const handleContractorChange = (contractorId) => {
    const contractor = contractors.find(c => c._id === contractorId);
    setSites(contractor?.sites?.filter(s => s.isActive) || []);
    setFormData({
      ...formData,
      contractorId,
      siteId: '',
      attendanceRecords: [],
    });
  };

  const handleNext = () => {
    setError('');
    
    if (activeStep === 0 && !formData.contractorId) {
      setError('Please select a contractor');
      return;
    }
    if (activeStep === 1 && !formData.siteId) {
      setError('Please select a site');
      return;
    }
    if (activeStep === 2 && formData.employeeCount < 1) {
      setError('Please enter number of employees');
      return;
    }
    if (activeStep === 3) {
      const isValid = formData.attendanceRecords.length === formData.employeeCount &&
        formData.attendanceRecords.every(r => r.employeeId && r.shiftType);
      if (!isValid) {
        setError('Please fill all employee details');
        return;
      }
    }
    
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const attendanceData = {
        attendanceRecords: formData.attendanceRecords.map(record => ({
          employeeId: record.employeeId,
          contractorId: formData.contractorId,
          siteId: formData.siteId,
          date: formData.date,
          shiftType: record.shiftType,
          remarks: record.remarks || '',
        }))
      };

      await attendanceService.create(attendanceData);
      
      setSuccess(`Attendance marked successfully for ${attendanceData.attendanceRecords.length} workers!`);
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      // Improved error message
      if (err && err.includes('already exists')) {
        setError('⚠️ Attendance already marked for one or more workers on this date at this site. Please check the Attendance List or select a different date.');
      } else {
        setError(err || 'Failed to mark attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      contractorId: '',
      siteId: '',
      employeeCount: 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      attendanceRecords: [],
    });
    setActiveStep(0);
    setError('');
    setSuccess('');
    setSites([]);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ContractorStep
            contractors={contractors}
            selectedContractor={formData.contractorId}
            onSelect={handleContractorChange}
          />
        );
      case 1:
        return (
          <SiteStep
            sites={sites}
            selectedSite={formData.siteId}
            onSelect={(siteId) => setFormData({ ...formData, siteId })}
          />
        );
      case 2:
        return (
          <EmployeeCountStep
            count={formData.employeeCount}
            onChange={(count) => {
              setFormData({
                ...formData,
                employeeCount: count,
                attendanceRecords: Array(count).fill(null).map(() => ({
                  employeeId: '',
                  shiftType: '',
                  remarks: '',
                }))
              });
            }}
          />
        );
      case 3:
        return (
          <EmployeeDetailsStep
            employees={employees}
            attendanceRecords={formData.attendanceRecords}
            onChange={(records) => setFormData({ ...formData, attendanceRecords: records })}
          />
        );
      case 4:
        return (
          <DateStep
            date={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mark Attendance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceForm;
