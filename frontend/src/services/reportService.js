import api from './api';

const reportService = {
  // Get contractor report
  getContractorReport: async (params) => {
    try {
      const response = await api.get('/reports/contractor', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee report
  getEmployeeReport: async (params) => {
    try {
      const response = await api.get('/reports/employee', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance summary
  getAttendanceSummary: async (params) => {
    try {
      const response = await api.get('/reports/summary', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reportService;
