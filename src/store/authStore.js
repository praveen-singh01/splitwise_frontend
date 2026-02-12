import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
    user: authService.getStoredUser(),
    token: authService.getStoredToken(),
    isAuthenticated: authService.isAuthenticated(),

    login: async (email, password) => {
        const { token, user } = await authService.login(email, password);
        set({ user, token, isAuthenticated: true });
    },

    signup: async (name, email, password) => {
        const { token, user } = await authService.signup(name, email, password);
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
    },

    setUser: (user) => set({ user }),
}));

export default useAuthStore;
