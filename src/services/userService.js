import api from './api';

const userService = {
    async getAllUsers() {
        const response = await api.get('/auth/users');
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch users');
    },
};

export default userService;
