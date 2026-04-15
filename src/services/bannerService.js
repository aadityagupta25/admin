import { apiService } from './api';

const BANNERS_ENDPOINT = '/banners';

export const bannerService = {
    // Get all banners with optional status filter
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);

        const queryString = params.toString();
        const url = queryString ? `${BANNERS_ENDPOINT}?${queryString}` : BANNERS_ENDPOINT;

        return await apiService.get(url);
    },

    // Get active banners only
    getActive: async () => {
        return await apiService.get(`${BANNERS_ENDPOINT}/active`);
    },

    // Get banner by ID
    getById: async (bannerId) => {
        return await apiService.get(`${BANNERS_ENDPOINT}/${bannerId}`);
    },

    // Create new banner
    create: async (bannerData) => {
        const formData = new FormData();

        if (bannerData.banner_img) {
            formData.append('banner_img', bannerData.banner_img);
        }
        formData.append('url', bannerData.url);
        formData.append('status', bannerData.status);

        return await apiService.upload(BANNERS_ENDPOINT, formData);
    },

    // Update banner
    update: async (bannerId, bannerData) => {
        const formData = new FormData();

        if (bannerData.banner_img && bannerData.banner_img instanceof File) {
            formData.append('banner_img', bannerData.banner_img);
        }
        if (bannerData.url) formData.append('url', bannerData.url);
        if (bannerData.status !== undefined) formData.append('status', bannerData.status);

        return await apiService.put(`${BANNERS_ENDPOINT}/${bannerId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Delete banner
    delete: async (bannerId) => {
        return await apiService.delete(`${BANNERS_ENDPOINT}/${bannerId}`);
    },
};

export default bannerService;
