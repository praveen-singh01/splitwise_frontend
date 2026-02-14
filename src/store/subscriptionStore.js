import { create } from 'zustand';
import subscriptionService from '../services/subscriptionService';

const useSubscriptionStore = create((set) => ({
    plans: [],
    currentPlan: 'free',
    subscriptionStatus: null,
    loading: false,
    error: null,

    /**
     * Fetch all subscription plans
     */
    fetchPlans: async () => {
        set({ loading: true, error: null });
        try {
            const plans = await subscriptionService.getPlans();
            set({ plans, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch plans',
                loading: false,
            });
        }
    },

    /**
     * Fetch current subscription status
     */
    fetchStatus: async () => {
        set({ loading: true, error: null });
        try {
            const status = await subscriptionService.getStatus();
            set({
                subscriptionStatus: status,
                currentPlan: status.plan || 'free',
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch status',
                loading: false,
            });
        }
    },

    /**
     * Initiate Razorpay checkout
     */
    initiateCheckout: async (planId) => {
        set({ loading: true, error: null });
        try {
            const checkoutData = await subscriptionService.createCheckout(planId);
            set({ loading: false });
            return checkoutData;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create checkout',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),
}));

export default useSubscriptionStore;
