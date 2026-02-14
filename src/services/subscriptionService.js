import api from './api';

/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

/**
 * Get all subscription plans
 */
export const getPlans = async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data.data;
};

/**
 * Get current user's subscription status
 */
export const getStatus = async () => {
    const response = await api.get('/subscriptions/status');
    return response.data.data;
};

/**
 * Create Razorpay checkout session
 */
export const createCheckout = async (planId) => {
    const response = await api.post('/subscriptions/checkout', { planId });
    return response.data.data;
};

export default {
    getPlans,
    getStatus,
    createCheckout,
};
