import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with clsx
 * @param {...any} inputs - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Sleep/delay utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} - Whether value is empty
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Get full image URL for API assets
 * Handles both dev (relative /api) and prod (full URL) cases
 * @param {string} imagePath - Relative image path from API (e.g., /uploads/users/...)
 * @returns {string|null} - Full image URL or null if no path
 */
export function getFullImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If already absolute URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // In dev: API_URL = '/api', in prod: API_URL = 'http://31.97.62.250:3000/api'
  // For images, we need the base URL without /api suffix
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  if (apiUrl.startsWith('http')) {
    // Production: remove /api suffix and append image path
    const baseUrl = apiUrl.replace(/\/api$/, '');
    return `${baseUrl}${imagePath}`;
  } else {
    // Development: use relative path as-is (proxy will handle it)
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
}

