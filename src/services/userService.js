import { apiService } from './api';

const USERS_ENDPOINT = '/users';

export const userService = {
    // Get all users with optional filters
    getAll: async (filters = {}) => {
        console.log('[UserService] Getting all users...');
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);
        if (filters.country) params.append('country', filters.country);

        const queryString = params.toString();
        const url = queryString ? `${USERS_ENDPOINT}?${queryString}` : USERS_ENDPOINT;

        console.log('[UserService] Request URL:', url);
        try {
            const result = await apiService.get(url);
            console.log('[UserService] Response:', result);
            return result;
        } catch (error) {
            console.error('[UserService] Error:', error);
            throw error;
        }
    },

    // Get user by ID
    getById: async (userId) => {
        return await apiService.get(`${USERS_ENDPOINT}/${userId}`);
    },

    // Create new user
    create: async (userData) => {
        const formData = new FormData();

        // Add text fields only if they have values
        if (userData.full_name) formData.append('full_name', userData.full_name);
        if (userData.mobile_number) formData.append('mobile_number', userData.mobile_number);
        if (userData.password) formData.append('password', userData.password);
        if (userData.email) formData.append('email', userData.email);
        if (userData.gender) formData.append('gender', userData.gender);
        if (userData.country) formData.append('country', userData.country);
        if (userData.language) formData.append('language', userData.language);
        if (userData.dob) formData.append('dob', userData.dob);

        if (userData.wallet) {
            formData.append('wallet', JSON.stringify(userData.wallet));
        }

        // Add file fields if present
        if (userData.profile_img) {
            formData.append('profile_img', userData.profile_img);
        }
        if (userData.bg_img) {
            formData.append('bg_img', userData.bg_img);
        }

        return await apiService.upload(USERS_ENDPOINT, formData);
    },

    // Update user
    update: async (userUid, userData) => {
        const formData = new FormData();

        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && userData[key] !== null) {
                if (key === 'profile_img' || key === 'bg_img') {
                    if (userData[key] instanceof File) formData.append(key, userData[key]);
                } else if (key === 'wallet') {
                    formData.append(key, JSON.stringify(userData[key]));
                } else {
                    formData.append(key, userData[key]);
                }
            }
        });

        return await apiService.put(`${USERS_ENDPOINT}/${userUid}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Toggle user status (active/inactive)
    toggleStatus: async (userUid, status) => {
        return await apiService.put(`${USERS_ENDPOINT}/${userUid}`, { status: status === 1 || status === true });
    },

    // Get wallet transaction history
    getWalletHistory: async (userId) => {
        return await apiService.get(`${USERS_ENDPOINT}/wallet-history/${userId}`);
    },

    // Get wallet transaction history
    getWalletHistory: async (userId) => {
        return await apiService.get(`${USERS_ENDPOINT}/wallet-history/${userId}`);
    },

    // Delete user (soft delete)
    delete: async (userUid) => {
        return await apiService.delete(`${USERS_ENDPOINT}/${userUid}`);
    },
};

export default userService;
