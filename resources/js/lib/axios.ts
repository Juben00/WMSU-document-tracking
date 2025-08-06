import axios from 'axios';

// Get CSRF token from meta tag
const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
};

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Add request interceptor to automatically add CSRF token
axios.interceptors.request.use(
    (config) => {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle CSRF token errors
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch, refresh the page
            console.warn('CSRF token mismatch, refreshing page...');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default axios;
