import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useGroupStore from '../store/groupStore';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import toast from 'react-hot-toast';

const GroupModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', description: '', members: [] });
    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, fetchUsers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', description: '', members: [] });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Create Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Group Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="3"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Add Members</label>
                        <select
                            multiple
                            value={formData.members}
                            onChange={(e) => setFormData({ ...formData, members: Array.from(e.target.selectedOptions, option => option.value) })}
                            className="w-full px-3 py-2 border rounded-md"
                            size="5"
                        >
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Groups = () => {
    const navigate = useNavigate();
    const { groups, loading, fetchGroups, createGroup } = useGroupStore();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleCreateGroup = () => {
        // Check user's subscription plan from auth store
        const userPlan = user?.subscription?.plan || user?.currentPlan || 'free';

        if (userPlan === 'free') {
            toast.error('Premium subscription required to create groups');
            navigate('/subscription');
            return;
        }
        setShowModal(true);
    };

    const handleSubmit = async (data) => {
        try {
            await createGroup(data);
            toast.success('Group created successfully!');
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Groups</h1>
                    <button
                        onClick={handleCreateGroup}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        + Create Group
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg">No groups yet</p>
                        <p className="text-gray-500 mt-2">Create your first group to start tracking shared expenses</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => (
                            <div
                                key={group._id}
                                onClick={() => navigate(`/groups/${group._id}`)}
                                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{group.description || 'No description'}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    {group.members?.length || 0} members
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <GroupModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Groups;
