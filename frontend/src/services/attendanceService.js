import api from './api';

const attendanceService = {
  // Create attendance records (bulk)
  create: async (data) => {
    try {
      const response = await api.post('/attendance', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to create attendance';
    }
  },

  // Get all attendance records with filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/attendance', { params });
      
      // Ensure data is always an array
      return {
        success: true,
        data: Array.isArray(response.data?.data) ? response.data.data : [],
        count: response.data?.count || 0,
      };
    } catch (error) {
      console.error('Attendance fetch error:', error);
      // Return empty array structure on error
      return {
        success: false,
        data: [],
        count: 0,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get attendance by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to fetch attendance';
    }
  },

  // Update attendance
  update: async (id, data) => {
    try {
      const response = await api.put(`/attendance/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to update attendance';
    }
  },

  // Delete attendance
  delete: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to delete attendance';
    }
  },
};

export default attendanceService;
