// API Configuration - centralized URL management
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API = {
    baseUrl: API_BASE_URL,

    // Helper to construct full API URLs
    url: (path) => `${API_BASE_URL}${path}`,

    // Image URL helper
    imageUrl: (path) => path ? `${API_BASE_URL}${path}` : null,
};

export default API;
