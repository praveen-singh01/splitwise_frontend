import api from './api';

const balanceService = {
    async getBalances(userId = null) {
        const params = userId ? `?userId=${userId}` : '';
        const response = await api.get(`/balances${params}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get balances');
    },
};

export default balanceService;
