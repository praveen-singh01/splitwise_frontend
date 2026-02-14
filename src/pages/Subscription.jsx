import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../store/subscriptionStore';
import toast from 'react-hot-toast';

const PlanCard = ({ plan, currentPlan, onUpgrade }) => {
    const isCurrentPlan = currentPlan === plan.name.toLowerCase();
    const isPremium = plan.name.toLowerCase() !== 'free';

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
            {isCurrentPlan && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mb-2">
                    Current Plan
                </span>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">
                ₹{plan.price}
                <span className="text-sm text-gray-600">/{plan.interval}</span>
            </p>
            <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
            {!isCurrentPlan && isPremium && (
                <button
                    onClick={() => onUpgrade(plan)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    Upgrade to {plan.name}
                </button>
            )}
            {isCurrentPlan && (
                <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed"
                >
                    Current Plan
                </button>
            )}
            {!isCurrentPlan && !isPremium && (
                <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed"
                >
                    Free Plan
                </button>
            )}
        </div>
    );
};

const Subscription = () => {
    const navigate = useNavigate();
    const { plans, currentPlan, loading, fetchPlans, fetchStatus, initiateCheckout } = useSubscriptionStore();

    useEffect(() => {
        fetchPlans();
        fetchStatus();
    }, [fetchPlans, fetchStatus]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async (plan) => {
        try {
            // Load Razorpay script
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Failed to load payment gateway');
                return;
            }

            // Create checkout session
            const checkoutData = await initiateCheckout(plan.razorpayPlanId);

            // Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                subscription_id: checkoutData.subscriptionId,
                name: 'Splitwise Clone',
                description: `${plan.name} Subscription`,
                handler: async function (response) {
                    toast.success('Subscription successful!');
                    await fetchStatus();
                    navigate('/');
                },
                prefill: {
                    email: checkoutData.email || '',
                },
                theme: {
                    color: '#3B82F6',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to initiate checkout');
        }
    };

    if (loading && plans.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                    <p className="text-xl text-gray-600">
                        Upgrade to unlock premium features like Groups and more
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            currentPlan={currentPlan}
                            onUpgrade={handleUpgrade}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
