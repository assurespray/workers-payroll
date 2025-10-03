import api from './api';

const attendanceService = {
  // Create attendance
  create: async (attendanceData) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all attendance
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/attendance', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single attendance
  getById: async (id) => {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update attendance
  update: async (id, attendanceData) => {
    try {
      const response = await api.put(`/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete attendance
  delete: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default attendanceService;
