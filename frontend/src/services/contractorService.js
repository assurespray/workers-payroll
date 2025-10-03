import api from './api';

const contractorService = {
  // Get all contractors
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/contractors', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single contractor
  getById: async (id) => {
    try {
      const response = await api.get(`/contractors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create contractor
  create: async (contractorData) => {
    try {
      const response = await api.post('/contractors', contractorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update contractor
  update: async (id, contractorData) => {
    try {
      const response = await api.put(`/contractors/${id}`, contractorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete contractor
  delete: async (id) => {
    try {
      const response = await api.delete(`/contractors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get sites for contractor
  getSites: async (contractorId) => {
    try {
      const response = await api.get(`/contractors/${contractorId}/sites`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add site to contractor
  addSite: async (contractorId, siteData) => {
    try {
      const response = await api.post(`/contractors/${contractorId}/sites`, siteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update site
  updateSite: async (contractorId, siteId, siteData) => {
    try {
      const response = await api.put(`/contractors/${contractorId}/sites/${siteId}`, siteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete site
  deleteSite: async (contractorId, siteId) => {
    try {
      const response = await api.delete(`/contractors/${contractorId}/sites/${siteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default contractorService;
