import { apiService } from './api';

const FEEDS_ENDPOINT = '/feeds';

export const feedService = {
    // Get all feeds with optional filters
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.media_type) params.append('media_type', filters.media_type);
        if (filters.limit) params.append('limit', filters.limit);

        const queryString = params.toString();
        const url = queryString ? `${FEEDS_ENDPOINT}?${queryString}` : FEEDS_ENDPOINT;

        return await apiService.get(url);
    },

    // Get feeds by user
    getByUser: async (userId, limit = 50) => {
        return await apiService.get(`${FEEDS_ENDPOINT}/user/${userId}?limit=${limit}`);
    },

    // Get feed by ID (increments view count)
    getById: async (feedId) => {
        return await apiService.get(`${FEEDS_ENDPOINT}/${feedId}`);
    },

    // Get feed count
    getCount: async () => {
        return await apiService.get(`${FEEDS_ENDPOINT}/count`);
    },

    // Create new feed
    create: async (feedData) => {
        const formData = new FormData();

        if (feedData.media) {
            formData.append('media', feedData.media);
        }
        if (feedData.thumbnail) {
            formData.append('thumbnail', feedData.thumbnail);
        }
        formData.append('user_id', feedData.user_id);
        formData.append('details', feedData.details);

        if (feedData.hashtags) {
            formData.append('hashtags', JSON.stringify(feedData.hashtags));
        }
        if (feedData.mentions) {
            formData.append('mentions', JSON.stringify(feedData.mentions));
        }
        if (feedData.location) {
            formData.append('location', feedData.location);
        }
        formData.append('status', feedData.status || 'true');

        return await apiService.upload(FEEDS_ENDPOINT, formData);
    },

    // Update feed
    update: async (feedId, feedData) => {
        const formData = new FormData();
        Object.keys(feedData).forEach(key => {
            if (feedData[key] !== undefined && feedData[key] !== null) {
                if ((key === 'media' || key === 'thumbnail') && feedData[key] instanceof File) {
                    formData.append(key, feedData[key]);
                } else if (key === 'hashtags' || key === 'mentions') {
                    formData.append(key, JSON.stringify(feedData[key]));
                } else {
                    formData.append(key, feedData[key]);
                }
            }
        });
        return await apiService.put(`${FEEDS_ENDPOINT}/${feedId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Toggle feed status (admin moderation)
    toggleStatus: async (feedId) => {
        return await apiService.patch(`${FEEDS_ENDPOINT}/${feedId}/toggle-status`);
    },

    // Delete feed (soft delete)
    delete: async (feedId) => {
        return await apiService.delete(`${FEEDS_ENDPOINT}/${feedId}`);
    },

    // Admin-only: Get reported feeds (if endpoint exists)
    getReported: async () => {
        return await apiService.get(`${FEEDS_ENDPOINT}/reported`);
    },
};

export default feedService;
