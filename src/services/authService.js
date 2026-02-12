import api from './api';

const authService = {
    async signup(name, email, password) {
        const response = await api.post('/auth/signup', { name, email, password });
        if (response.data.success) {
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token, user };
        }
        throw new Error(response.data.message || 'Signup failed');
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token, user };
        }
        throw new Error(response.data.message || 'Login failed');
    },

    async getProfile() {
        const response = await api.get('/auth/me');
        if (response.data.success) {
            const user = response.data.data;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        throw new Error(response.data.message || 'Failed to get profile');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getStoredToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getStoredToken();
    },
};

export default authService;
