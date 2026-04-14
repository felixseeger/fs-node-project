import axios from 'axios';

/**
 * Luma AI Service
 * Handles interactions with Luma's Dream Machine and Photon APIs.
 */

const LUMA_API_BASE = 'https://api.lumalabs.ai/dream-machine/v1';

/**
 * Create a Luma AI client
 * @param {string} apiKey - Luma API Key
 */
export const createLumaClient = (apiKey) => {
  const instance = axios.create({
    baseURL: LUMA_API_BASE,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return {
    /**
     * Create a video generation request
     * @param {Object} params - Generation parameters
     */
    async createVideo(params) {
      const response = await instance.post('/generations', params);
      return response.data;
    },

    /**
     * Create an image generation request
     * @param {Object} params - Generation parameters
     */
    async createImage(params) {
      const response = await instance.post('/generations/image', params);
      return response.data;
    },

    /**
     * Retrieve status and assets of a specific generation
     * @param {string} id - Generation ID
     */
    async getStatus(id) {
      const response = await instance.get(`/generations/${id}`);
      return response.data;
    },

    /**
     * List all generations
     * @param {number} limit - Number of items to return
     * @param {number} offset - Offset for pagination
     */
    async listGenerations(limit = 10, offset = 0) {
      const response = await instance.get('/generations', {
        params: { limit, offset }
      });
      return response.data;
    },

    /**
     * Delete a specific generation
     * @param {string} id - Generation ID
     */
    async deleteGeneration(id) {
      const response = await instance.delete(`/generations/${id}`);
      return response.data;
    },

    /**
     * List supported camera motions
     */
    async getCameraMotions() {
      const response = await instance.get('/generations/camera_motion/list');
      return response.data;
    }
  };
};

export default {
  createLumaClient
};
