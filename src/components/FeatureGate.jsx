import { Navigate } from 'react-router-dom';
import useSubscriptionStore from '../store/subscriptionStore';
import toast from 'react-hot-toast';

/**
 * Feature Gate Component
 * Wraps premium features and shows upgrade prompt if not subscribed
 */
const FeatureGate = ({ children, requiredPlan = 'premium', fallback }) => {
    const { currentPlan } = useSubscriptionStore();

    const planHierarchy = { free: 0, premium: 1, enterprise: 2 };
    const userPlanLevel = planHierarchy[currentPlan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 1;

    const hasAccess = userPlanLevel >= requiredPlanLevel;

    if (!hasAccess) {
        if (fallback) {
            return fallback;
        }

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature</h2>
                    <p className="text-gray-600 mb-6">
                        This feature requires a {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} subscription.
                        Upgrade now to unlock this and other premium features!
                    </p>
                    <Navigate to="/subscription" replace />
                </div>
            </div>
        );
    }

    return children;
};

export default FeatureGate;
