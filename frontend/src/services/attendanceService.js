import api from './api';

const attendanceService = {
  // Create attendance (bulk)
  create: async (data) => {
    try {
      const response = await api.post('/attendance', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to create attendance';
    }
  },

  // Get all attendance
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/attendance', { params });
      
      // Return the response directly - backend already formats it
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      // Return empty structure on error
      return {
        success: false,
        count: 0,
        data: [],
        message: error.response?.data?.message || error.message
      };
    }
  },

  // Delete attendance
  delete: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to delete';
    }
  },
};

export default attendanceService;
