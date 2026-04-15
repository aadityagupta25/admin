import { apiService } from './api';

const ENDPOINT = '/backgrounds';

export const backgroundService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.screen_name) params.append('screen_name', filters.screen_name);
        const qs = params.toString();
        return await apiService.get(qs ? `${ENDPOINT}?${qs}` : ENDPOINT);
    },

    getById: async (id) => await apiService.get(`${ENDPOINT}/${id}`),

    create: async (data) => {
        const formData = new FormData();
        formData.append('screen_name', data.screen_name);
        formData.append('image', data.image);
        formData.append('status', data.status ?? true);
        return await apiService.upload(ENDPOINT, formData);
    },

    update: async (id, data) => {
        const formData = new FormData();
        if (data.screen_name !== undefined) formData.append('screen_name', data.screen_name);
        if (data.image instanceof File) formData.append('image', data.image);
        if (data.status !== undefined) formData.append('status', data.status);
        return await apiService.put(`${ENDPOINT}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    delete: async (id) => await apiService.delete(`${ENDPOINT}/${id}`),
};

export default backgroundService;
