import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Login from './components/auth/Login';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import ContractorList from './components/contractors/ContractorList';
import AttendanceForm from './components/attendance/AttendanceForm';
import AttendanceList from './components/attendance/AttendanceList';
import ContractorReport from './components/reports/ContractorReport';
import EmployeeReport from './components/reports/EmployeeReport';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="contractors" element={<ContractorList />} />
            <Route path="attendance" element={<AttendanceForm />} />
            <Route path="attendance/list" element={<AttendanceList />} />
            <Route path="reports/contractor" element={<ContractorReport />} />
            <Route path="reports/employee" element={<EmployeeReport />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
            
