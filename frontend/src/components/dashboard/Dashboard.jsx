import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as ContractorIcon,
  CheckCircle as AttendanceIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import employeeService from '../../services/employeeService';
import contractorService from '../../services/contractorService';
import attendanceService from '../../services/attendanceService';
import { format } from 'date-fns';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalContractors: 0,
    todayAttendance: 0,
    totalSites: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employees
      const employeesRes = await employeeService.getAll();
      
      // Fetch contractors
      const contractorsRes = await contractorService.getAll();
      
      // Calculate total sites
      const totalSites = contractorsRes.data.reduce((sum, contractor) => {
        return sum + (contractor.sites?.filter(s => s.isActive).length || 0);
      }, 0);

      // Fetch today's attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const attendanceRes = await attendanceService.getAll({
        startDate: today,
        endDate: today,
      });

      setStats({
        totalEmployees: employeesRes.count || 0,
        totalContractors: contractorsRes.count || 0,
        todayAttendance: attendanceRes.count || 0,
        totalSites,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box sx={{ color, fontSize: 48 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {format(new Date(), 'EEEE, MMMM d, yyyy')}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contractors"
            value={stats.totalContractors}
            icon={<ContractorIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Work Sites"
            value={stats.totalSites}
            icon={<TrendingIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Attendance"
            value={stats.todayAttendance}
            icon={<AttendanceIcon />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Use the sidebar navigation to:
        </Typography>
        <Box component="ul" sx={{ mt: 2 }}>
          <li>Manage employees and their details</li>
          <li>Add contractors and work locations</li>
          <li>Mark daily attendance for workers</li>
          <li>Generate detailed reports</li>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
