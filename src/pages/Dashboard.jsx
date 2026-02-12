import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ExpenseCard from '../components/ExpenseCard';
import Button from '../components/Button';
import useExpenseStore from '../store/expenseStore';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const navigate = useNavigate();
    const { expenses, loading, fetchExpenses, deleteExpense } = useExpenseStore();
    const user = useAuthStore((state) => state.user);

    const [filters, setFilters] = useState({
        userId: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchExpenses(filters);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const activeFilters = {};
        if (filters.userId) activeFilters.userId = filters.userId;
        if (filters.startDate) activeFilters.startDate = filters.startDate;
        if (filters.endDate) activeFilters.endDate = filters.endDate;
        fetchExpenses(activeFilters);
    };

    const clearFilters = () => {
        setFilters({ userId: '', startDate: '', endDate: '' });
        fetchExpenses({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(id);
            } catch (error) {
                alert('Failed to delete expense');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
                    <Button onClick={() => navigate('/expenses/new')}>
                        + Add Expense
                    </Button>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by User
                            </label>
                            <select
                                name="userId"
                                value={filters.userId}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Users</option>
                                <option value={user?._id}>My Expenses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="input"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={applyFilters}>Apply Filters</Button>
                        <Button variant="secondary" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Expenses List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-12 card">
                        <p className="text-gray-500 mb-4">No expenses found</p>
                        <Button onClick={() => navigate('/expenses/new')}>
                            Create your first expense
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expenses.map((expense) => (
                            <ExpenseCard
                                key={expense._id}
                                expense={expense}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
