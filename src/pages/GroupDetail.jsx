import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useGroupStore from '../store/groupStore';
import useUserStore from '../store/userStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentGroup, loading, fetchGroupById, addMember, removeMember, deleteGroup } = useGroupStore();
    const { users, fetchUsers } = useUserStore();
    const { user: currentUser } = useAuthStore();
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        fetchGroupById(id);
        fetchUsers();
    }, [id, fetchGroupById, fetchUsers]);

    const isCreator = currentGroup?.createdBy?._id === currentUser?._id || currentGroup?.createdBy === currentUser?._id;

    const availableUsers = users.filter(
        u => !currentGroup?.members?.some(m => (m._id || m) === u._id)
    );

    const handleAddMember = async () => {
        if (!selectedUser) return;
        try {
            await addMember(id, selectedUser);
            toast.success('Member added successfully!');
            setShowAddMember(false);
            setSelectedUser('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await removeMember(id, userId);
            toast.success('Member removed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove member');
        }
    };

    const handleDeleteGroup = async () => {
        if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
        try {
            await deleteGroup(id);
            toast.success('Group deleted successfully!');
            navigate('/groups');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete group');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!currentGroup) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4 text-center">
                    <p className="text-gray-600">Group not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button
                    onClick={() => navigate('/groups')}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Groups
                </button>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{currentGroup.name}</h1>
                            <p className="text-gray-600">{currentGroup.description || 'No description'}</p>
                        </div>
                        {isCreator && (
                            <button
                                onClick={handleDeleteGroup}
                                className="text-red-600 hover:text-red-700 px-3 py-1 border border-red-600 rounded-md"
                            >
                                Delete Group
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Members ({currentGroup.members?.length || 0})</h2>
                        {isCreator && (
                            <button
                                onClick={() => setShowAddMember(!showAddMember)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                + Add Member
                            </button>
                        )}
                    </div>

                    {showAddMember && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-md">
                            <label className="block text-gray-700 mb-2">Select User</label>
                            <div className="flex space-x-2">
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-md"
                                >
                                    <option value="">Choose a user...</option>
                                    {availableUsers.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddMember}
                                    disabled={!selectedUser}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {currentGroup.members?.map((member) => {
                            const memberId = member._id || member;
                            const memberData = typeof member === 'object' ? member : users.find(u => u._id === member);
                            const isGroupCreator = currentGroup.createdBy?._id === memberId || currentGroup.createdBy === memberId;

                            return (
                                <div key={memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {(memberData?.name || 'U')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{memberData?.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-600">{memberData?.email || ''}</p>
                                        </div>
                                        {isGroupCreator && (
                                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                Creator
                                            </span>
                                        )}
                                    </div>
                                    {isCreator && !isGroupCreator && (
                                        <button
                                            onClick={() => handleRemoveMember(memberId)}
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Group Expenses</h2>
                    <button
                        onClick={() => navigate(`/expenses/new?groupId=${id}`)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        + Add Expense to Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
