import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SettlementCard from '../components/SettlementCard';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';
import balanceService from '../services/balanceService';

const Balances = () => {
    const user = useAuthStore((state) => state.user);
    const [balanceData, setBalanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'personal'

    useEffect(() => {
        fetchBalances();
    }, [viewMode]);

    const fetchBalances = async () => {
        setLoading(true);
        setError('');
        try {
            const userId = viewMode === 'personal' ? user._id : null;
            const data = await balanceService.getBalances(userId);
            setBalanceData(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch balances');
        } finally {
            setLoading(false);
        }
    };

    const getUserName = (userId) => {
        // If it's the current user, return 'You'
        if (userId === user._id) return 'You';
        return balanceData?.users?.[userId]?.name || userId;
    };

    const renderAllBalances = () => {
        if (!balanceData?.balances || !balanceData?.settlements) {
            return <p className="text-gray-500">No balance data available</p>;
        }

        const { balances, settlements } = balanceData;

        return (
            <div>
                {/* Net Balances */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Net Balances</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(balances).map(([userId, balance]) => (
                            <div key={userId} className="card">
                                <p className="text-lg font-semibold text-gray-900 mb-1">{getUserName(userId)}</p>
                                <p
                                    className={`text-2xl font-bold ${balance > 0
                                        ? 'text-green-600'
                                        : balance < 0
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                        }`}
                                >
                                    {balance > 0 ? '+' : ''}₹{balance.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {balance > 0 ? 'Gets back' : balance < 0 ? 'Owes' : 'Settled up'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optimized Settlements */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Suggested Settlements ({settlements.length} transaction{settlements.length !== 1 ? 's' : ''})
                    </h2>
                    {settlements.length === 0 ? (
                        <div className="card text-center py-8">
                            <p className="text-gray-500">All settled up! 🎉</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {settlements.map((settlement, index) => (
                                <SettlementCard
                                    key={index}
                                    settlement={{
                                        ...settlement,
                                        fromName: getUserName(settlement.from),
                                        toName: getUserName(settlement.to)
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderPersonalBalances = () => {
        if (!balanceData) {
            return <p className="text-gray-500">No balance data available</p>;
        }

        const { netBalance, owes, owedBy } = balanceData;

        return (
            <div>
                {/* Personal Net Balance */}
                <div className="card mb-8 text-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Net Balance</h2>
                    <p
                        className={`text-5xl font-bold ${netBalance > 0
                            ? 'text-green-600'
                            : netBalance < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                    >
                        {netBalance > 0 ? '+' : ''}₹{netBalance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        {netBalance > 0
                            ? 'You will get back'
                            : netBalance < 0
                                ? 'You owe'
                                : 'You are settled up'}
                    </p>
                </div>

                {/* You Owe */}
                {owes && owes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">You Owe</h2>
                        <div className="space-y-4">
                            {owes.map((settlement, index) => (
                                <SettlementCard
                                    key={index}
                                    settlement={{
                                        ...settlement,
                                        fromName: 'You',
                                        toName: getUserName(settlement.to)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Owed to You */}
                {owedBy && owedBy.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Owed to You</h2>
                        <div className="space-y-4">
                            {owedBy.map((settlement, index) => (
                                <SettlementCard
                                    key={index}
                                    settlement={{
                                        ...settlement,
                                        fromName: getUserName(settlement.from),
                                        toName: 'You'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {(!owes || owes.length === 0) && (!owedBy || owedBy.length === 0) && (
                    <div className="card text-center py-8">
                        <p className="text-gray-500">All settled up! 🎉</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Balances</h1>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setViewMode('all')}
                        >
                            All Balances
                        </Button>
                        <Button
                            variant={viewMode === 'personal' ? 'primary' : 'secondary'}
                            onClick={() => setViewMode('personal')}
                        >
                            My Balance
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading balances...</p>
                    </div>
                ) : error ? (
                    <div className="card bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                ) : (
                    <div>{viewMode === 'all' ? renderAllBalances() : renderPersonalBalances()}</div>
                )}
            </div>
        </div>
    );
};

export default Balances;
