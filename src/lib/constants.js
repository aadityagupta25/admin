// Application Constants

const API_URL = import.meta.env.VITE_API_URL || 'https://api.pololive.cloud/api';

export { API_URL };
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Polo Live';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    GET: (id) => `/users/${id}`,
  },
  BANNERS: {
    LIST: '/banners',
    CREATE: '/banners',
    UPDATE: (id) => `/banners/${id}`,
    DELETE: (id) => `/banners/${id}`,
  },
  FEEDS: {
    LIST: '/feeds',
    CREATE: '/feeds',
    UPDATE: (id) => `/feeds/${id}`,
    DELETE: (id) => `/feeds/${id}`,
  },
  PARTY: {
    LIST: '/parties',
    CREATE: '/parties',
    UPDATE: (id) => `/parties/${id}`,
    DELETE: (id) => `/parties/${id}`,
  },
  SOUND_EFFECTS: {
    LIST: '/sound-effects',
    CREATE: '/sound-effects',
    UPDATE: (id) => `/sound-effects/${id}`,
    DELETE: (id) => `/sound-effects/${id}`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'polo_auth_token',
  REFRESH_TOKEN: 'polo_refresh_token',
  USER_DATA: 'polo_user_data',
  THEME: 'polo_theme',
  SIDEBAR_STATE: 'polo_sidebar_state',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  BANNERS: '/banners',
  FEEDS: '/feeds',
  PARTY: '/party',
  SOUND_EFFECTS: '/sound-effects',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM DD, YYYY hh:mm A',
  DATE_ONLY: 'MMMM DD, YYYY',
  TIME_ONLY: 'hh:mm A',
  SHORT: 'MM/DD/YYYY',
  ISO: 'YYYY-MM-DD',
};

// Status Options
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  DELETED: 'deleted',
};

// Allowed File Types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  DOCUMENTS: ['application/pdf', 'application/msword'],
};

// Max File Sizes (in bytes)
export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AUDIO: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};
