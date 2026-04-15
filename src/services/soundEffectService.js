import { apiService } from './api';

const SOUND_EFFECTS_ENDPOINT = '/sound-effects';

export const soundEffectService = {
    // Get all sound effects with optional status filter
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);

        const queryString = params.toString();
        const url = queryString ? `${SOUND_EFFECTS_ENDPOINT}?${queryString}` : SOUND_EFFECTS_ENDPOINT;

        return await apiService.get(url);
    },

    // Get active sound effects only
    getActive: async () => {
        return await apiService.get(`${SOUND_EFFECTS_ENDPOINT}/active`);
    },

    // Get sound effect by ID
    getById: async (soundId) => {
        return await apiService.get(`${SOUND_EFFECTS_ENDPOINT}/${soundId}`);
    },

    // Get sound effect count
    getCount: async () => {
        return await apiService.get(`${SOUND_EFFECTS_ENDPOINT}/count`);
    },

    // Create new sound effect
    create: async (soundData) => {
        const formData = new FormData();

        if (soundData.audio) {
            formData.append('audio', soundData.audio);
        }
        if (soundData.icon) {
            formData.append('icon', soundData.icon);
        }
        formData.append('name', soundData.name);
        formData.append('status', soundData.status !== undefined ? soundData.status : 1);

        return await apiService.upload(SOUND_EFFECTS_ENDPOINT, formData);
    },

    // Update sound effect
    update: async (soundId, soundData) => {
        const formData = new FormData();

        if (soundData.audio && soundData.audio instanceof File) {
            formData.append('audio', soundData.audio);
        }
        if (soundData.icon && soundData.icon instanceof File) {
            formData.append('icon', soundData.icon);
        }
        if (soundData.name) {
            formData.append('name', soundData.name);
        }
        if (soundData.status !== undefined) {
            formData.append('status', soundData.status);
        }
        return await apiService.put(`${SOUND_EFFECTS_ENDPOINT}/${soundId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Toggle sound effect status
    toggleStatus: async (soundId) => {
        return await apiService.patch(`${SOUND_EFFECTS_ENDPOINT}/${soundId}/toggle-status`);
    },

    // Delete sound effect (soft delete)
    delete: async (soundId) => {
        return await apiService.delete(`${SOUND_EFFECTS_ENDPOINT}/${soundId}`);
    },
};

export default soundEffectService;
