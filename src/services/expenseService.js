import api from './api';

const expenseService = {
    async createExpense(data) {
        const response = await api.post('/expenses', data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create expense');
    },

    async getExpenses(filters = {}) {
        const params = new URLSearchParams();
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/expenses?${params.toString()}`);
        if (response.data.success) {
            return {
                expenses: response.data.data,
                count: response.data.count,
            };
        }
        throw new Error(response.data.message || 'Failed to get expenses');
    },

    async getExpenseById(id) {
        const response = await api.get(`/expenses/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to get expense');
    },

    async updateExpense(id, data) {
        const response = await api.put(`/expenses/${id}`, data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update expense');
    },

    async deleteExpense(id) {
        const response = await api.delete(`/expenses/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to delete expense');
    },
};

export default expenseService;
