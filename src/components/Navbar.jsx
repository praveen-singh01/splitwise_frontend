import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-600">
                            Splitwise
                        </Link>
                        <div className="ml-10 flex space-x-4">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/balances"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Balances
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">
                            {user?.name || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
