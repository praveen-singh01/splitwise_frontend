import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import useExpenseStore from '../store/expenseStore';
import useAuthStore from '../store/authStore';
import useGroupStore from '../store/groupStore';
import expenseService from '../services/expenseService';
import userService from '../services/userService';

const ExpenseForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { addExpense, updateExpense } = useExpenseStore();
    const user = useAuthStore((state) => state.user);
    const { groups, fetchGroups } = useGroupStore();

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        paidBy: user?._id || '',
        participants: [],
        splitType: 'equal',
        percentageSplits: [],
        groupId: searchParams.get('groupId') || '',
        category: '',
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [percentageError, setPercentageError] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchGroups();
        if (isEdit) {
            loadExpense();
        }
    }, [id]);

    const fetchUsers = async () => {
        try {
            const allUsers = await userService.getAllUsers();
            setUsers(allUsers);
            if (user && !formData.paidBy) {
                setFormData((prev) => ({ ...prev, paidBy: user._id }));
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users');
        }
    };

    const loadExpense = async () => {
        try {
            const expense = await expenseService.getExpenseById(id);
            setFormData({
                description: expense.description,
                amount: expense.amount.toString(),
                paidBy: expense.paidBy._id || expense.paidBy,
                participants: expense.participants.map((p) => p._id || p),
                splitType: expense.splitType,
                percentageSplits: expense.percentageSplits || [],
                groupId: expense.groupId || '',
                category: expense.category || '',
            });

            // Extract unique users from expense
            const expenseUsers = [
                expense.paidBy,
                ...expense.participants,
            ].filter((u, i, arr) => arr.findIndex((t) => (t._id || t) === (u._id || u)) === i);
            setUsers(expenseUsers);
        } catch (err) {
            setError('Failed to load expense');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleParticipantsChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData((prev) => ({ ...prev, participants: selected }));

        // Initialize percentage splits
        if (formData.splitType === 'percentage') {
            const splits = selected.map((userId) => ({
                userId,
                percentage: (100 / selected.length).toFixed(2),
            }));
            setFormData((prev) => ({ ...prev, percentageSplits: splits }));
        }
    };

    const handlePercentageChange = (userId, percentage) => {
        const splits = formData.percentageSplits.map((split) =>
            split.userId === userId ? { ...split, percentage: parseFloat(percentage) || 0 } : split
        );
        setFormData((prev) => ({ ...prev, percentageSplits: splits }));

        // Validate total
        const total = splits.reduce((sum, split) => sum + split.percentage, 0);
        if (Math.abs(total - 100) > 0.01) {
            setPercentageError(`Total percentage is ${total.toFixed(2)}%. Must be 100%.`);
        } else {
            setPercentageError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.description || !formData.amount || !formData.paidBy || formData.participants.length === 0) {
            setError('Please fill all required fields');
            setLoading(false);
            return;
        }

        if (formData.splitType === 'percentage' && percentageError) {
            setError(percentageError);
            setLoading(false);
            return;
        }

        try {
            const data = {
                description: formData.description,
                amount: parseFloat(formData.amount),
                paidBy: formData.paidBy,
                participants: formData.participants,
                splitType: formData.splitType,
            };

            if (formData.splitType === 'percentage') {
                data.percentageSplits = formData.percentageSplits;
            }

            if (formData.groupId) {
                data.groupId = formData.groupId;
                data.category = formData.category;
            }

            if (isEdit) {
                await updateExpense(id, data);
            } else {
                await addExpense(data);
            }

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {isEdit ? 'Edit Expense' : 'Add New Expense'}
                </h1>

                <form onSubmit={handleSubmit} className="card">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g., Dinner at restaurant"
                        required
                    />

                    <Input
                        label="Amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                    />

                    <Select
                        label="Paid By"
                        name="paidBy"
                        value={formData.paidBy}
                        onChange={handleChange}
                        options={users.map((u) => ({
                            value: u._id || u,
                            label: u.name || u.email,
                        }))}
                        required
                    />

                    <Select
                        label="Group (Optional)"
                        name="groupId"
                        value={formData.groupId}
                        onChange={handleChange}
                        options={[
                            { value: '', label: 'No Group' },
                            ...groups.map((g) => ({
                                value: g._id,
                                label: g.name,
                            })),
                        ]}
                    />

                    {formData.groupId && (
                        <Input
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g., Food, Travel, Entertainment"
                        />
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Participants <span className="text-red-500">*</span>
                        </label>
                        <select
                            multiple
                            value={formData.participants}
                            onChange={handleParticipantsChange}
                            className="input h-32"
                            required
                        >
                            {users.map((u) => (
                                <option key={u._id || u} value={u._id || u}>
                                    {u.name || u.email}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <Select
                        label="Split Type"
                        name="splitType"
                        value={formData.splitType}
                        onChange={handleChange}
                        options={[
                            { value: 'equal', label: 'Equal Split' },
                            { value: 'percentage', label: 'Percentage Split' },
                        ]}
                        required
                    />

                    {formData.splitType === 'percentage' && formData.participants.length > 0 && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Percentage Distribution
                            </h3>
                            {percentageError && (
                                <p className="text-sm text-red-600 mb-2">{percentageError}</p>
                            )}
                            <div className="space-y-2">
                                {formData.participants.map((participantId) => {
                                    const participant = users.find((u) => (u._id || u) === participantId);
                                    const split = formData.percentageSplits.find((s) => s.userId === participantId);
                                    return (
                                        <div key={participantId} className="flex items-center gap-2">
                                            <span className="text-sm flex-1">
                                                {participant?.name || participant?.email}
                                            </span>
                                            <input
                                                type="number"
                                                value={split?.percentage || 0}
                                                onChange={(e) => handlePercentageChange(participantId, e.target.value)}
                                                className="input w-24"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                            />
                                            <span className="text-sm text-gray-500">%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading || !!percentageError} className="flex-1">
                            {loading ? 'Saving...' : isEdit ? 'Update Expense' : 'Create Expense'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/')}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
