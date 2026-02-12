import { create } from 'zustand';
import authService from '../services/authService';

const useUserStore = create((set) => ({
    users: [],
    loading: false,
    error: null,

    // For now, we'll fetch users from expenses
    // In a real app, you'd have a separate users endpoint
    setUsers: (users) => set({ users }),

    addUser: (user) =>
        set((state) => {
            const exists = state.users.find((u) => u._id === user._id);
            if (exists) return state;
            return { users: [...state.users, user] };
        }),
}));

export default useUserStore;
