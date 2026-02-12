import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from './Button';

const ExpenseCard = ({ expense, onDelete }) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isPaidByMe = expense.paidBy._id === user?._id || expense.paidBy === user?._id;

    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                        Paid by {isPaidByMe ? 'You' : expense.paidBy.name || expense.paidBy.email}
                    </p>
                </div>
            </div>

            <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Split Details:</p>
                <div className="space-y-1">
                    {expense.splitDetails.map((split) => {
                        const isMe = split.userId._id === user?._id || split.userId === user?._id;
                        return (
                            <div key={split.userId._id || split.userId} className="flex justify-between text-sm">
                                <span className={isMe ? 'font-medium' : ''}>
                                    {isMe ? 'You' : split.userId.name || split.userId.email}
                                </span>
                                <span className="text-gray-600">₹{split.amount.toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Split type: {expense.splitType === 'equal' ? 'Equal' : 'Percentage'}
                </p>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/expenses/${expense._id}/edit`)}
                    className="flex-1"
                >
                    Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={() => onDelete(expense._id)}
                    className="flex-1"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default ExpenseCard;
