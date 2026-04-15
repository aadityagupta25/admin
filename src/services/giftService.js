import { apiService } from './api';

const BASE = '/gifts/catalog';

export const giftService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        const q = params.toString();
        return await apiService.get(q ? `${BASE}?${q}` : BASE);
    },

    getById: async (id) => apiService.get(`${BASE}/${id}`),

    create: async (data) => {
        const form = new FormData();
        form.append('category', data.category);
        form.append('cost', data.cost);
        if (data.icon_image) form.append('icon_image', data.icon_image);
        form.append('status', data.status ?? 1);
        return await apiService.upload(BASE, form);
    },

    update: async (id, data) => {
        const form = new FormData();
        if (data.category !== undefined) form.append('category', data.category);
        if (data.cost !== undefined) form.append('cost', data.cost);
        if (data.icon_image instanceof File) form.append('icon_image', data.icon_image);
        if (data.status !== undefined) form.append('status', data.status);
        return await apiService.put(`${BASE}/${id}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    delete: async (id) => apiService.delete(`${BASE}/${id}`),
};

export default giftService;
