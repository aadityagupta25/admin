import { apiService } from './api';

const PARTIES_ENDPOINT = '/parties';

export const partyService = {
    // Get all parties with optional status filter
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status !== undefined) params.append('status', filters.status);

        const queryString = params.toString();
        const url = queryString ? `${PARTIES_ENDPOINT}?${queryString}` : PARTIES_ENDPOINT;

        return await apiService.get(url);
    },

    // Get parties by creator
    getByCreator: async (userId) => {
        return await apiService.get(`${PARTIES_ENDPOINT}/creator/${userId}`);
    },

    // Get party by ID
    getById: async (partyId) => {
        return await apiService.get(`${PARTIES_ENDPOINT}/${partyId}`);
    },

    // Get party count
    getCount: async () => {
        return await apiService.get(`${PARTIES_ENDPOINT}/count`);
    },

    // Create new party
    create: async (partyData) => {
        const formData = new FormData();

        if (partyData.img) {
            formData.append('img', partyData.img);
        }
        formData.append('name', partyData.name);
        formData.append('rule', partyData.rule);
        formData.append('created_by', partyData.created_by);
        formData.append('comment', partyData.comment || '');
        formData.append('room_lock', partyData.room_lock || 'false');
        formData.append('free_mode', partyData.free_mode || 'true');
        formData.append('is_mute', partyData.is_mute || 'false');
        formData.append('gift_effect', partyData.gift_effect || '');
        formData.append('entry_effect', partyData.entry_effect || '');
        formData.append('status', partyData.status || 'true');

        return await apiService.upload(PARTIES_ENDPOINT, formData);
    },

    // Update party
    update: async (partyId, partyData) => {
        const formData = new FormData();

        Object.keys(partyData).forEach(key => {
            if (partyData[key] !== undefined && partyData[key] !== null) {
                if (key === 'img' && partyData[key] instanceof File) {
                    formData.append(key, partyData[key]);
                } else {
                    formData.append(key, partyData[key]);
                }
            }
        });

        return await apiService.upload(`${PARTIES_ENDPOINT}/${partyId}`, formData);
    },

    // Toggle party status
    toggleStatus: async (partyId) => {
        return await apiService.patch(`${PARTIES_ENDPOINT}/${partyId}/toggle-status`);
    },

    // Delete party (soft delete)
    delete: async (partyId) => {
        return await apiService.delete(`${PARTIES_ENDPOINT}/${partyId}`);
    },
};

export default partyService;
