import { apiService } from './api';

const ENDPOINT = '/batch-levels';

export const batchLevelService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.level_type) params.append('level_type', filters.level_type);
        if (filters.batch_type) params.append('batch_type', filters.batch_type);
        const qs = params.toString();
        return await apiService.get(qs ? `${ENDPOINT}?${qs}` : ENDPOINT);
    },

    getActive: async () => apiService.get(`${ENDPOINT}/active`),

    getCount: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        const qs = params.toString();
        return await apiService.get(qs ? `${ENDPOINT}/count?${qs}` : `${ENDPOINT}/count`);
    },

    getById: async (id) => apiService.get(`${ENDPOINT}/${id}`),

    create: async (data) => {
        const formData = new FormData();
        formData.append('type', data.type);
        if (data.type === 'level') {
            formData.append('level_type', data.level_type);
            formData.append('level', data.level);
        } else {
            formData.append('batch_type', data.batch_type);
            formData.append('batch', data.batch);
        }
        formData.append('img', data.img);
        if (data.status !== undefined) formData.append('status', data.status);
        return await apiService.upload(ENDPOINT, formData);
    },

    update: async (id, data) => {
        const formData = new FormData();
        if (data.type) formData.append('type', data.type);
        if (data.type === 'level') {
            if (data.level_type) formData.append('level_type', data.level_type);
            if (data.level) formData.append('level', data.level);
        } else if (data.type === 'Batches') {
            if (data.batch_type) formData.append('batch_type', data.batch_type);
            if (data.batch) formData.append('batch', data.batch);
        }
        if (data.img instanceof File) formData.append('img', data.img);
        if (data.status !== undefined) formData.append('status', data.status);
        return await apiService.put(`${ENDPOINT}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    toggleStatus: async (id) => apiService.patch(`${ENDPOINT}/${id}/toggle-status`),

    delete: async (id) => apiService.delete(`${ENDPOINT}/${id}`),
};

export default batchLevelService;
