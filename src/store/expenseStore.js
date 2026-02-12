import { create } from 'zustand';
import expenseService from '../services/expenseService';

const useExpenseStore = create((set) => ({
    expenses: [],
    loading: false,
    error: null,

    fetchExpenses: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const { expenses } = await expenseService.getExpenses(filters);
            set({ expenses, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addExpense: async (data) => {
        set({ loading: true, error: null });
        try {
            const expense = await expenseService.createExpense(data);
            set((state) => ({
                expenses: [expense, ...state.expenses],
                loading: false,
            }));
            return expense;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateExpense: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updated = await expenseService.updateExpense(id, data);
            set((state) => ({
                expenses: state.expenses.map((exp) =>
                    exp._id === id ? updated : exp
                ),
                loading: false,
            }));
            return updated;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteExpense: async (id) => {
        set({ loading: true, error: null });
        try {
            await expenseService.deleteExpense(id);
            set((state) => ({
                expenses: state.expenses.filter((exp) => exp._id !== id),
                loading: false,
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

export default useExpenseStore;
