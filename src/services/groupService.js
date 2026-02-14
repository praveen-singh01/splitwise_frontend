import api from './api';

/**
 * Group Service
 * Handles all group-related API calls
 */

/**
 * Get all groups where user is a member
 */
export const getGroups = async () => {
    const response = await api.get('/groups');
    return response.data.data;
};

/**
 * Get group by ID
 */
export const getGroupById = async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data.data;
};

/**
 * Create new group
 */
export const createGroup = async (data) => {
    const response = await api.post('/groups', data);
    return response.data.data;
};

/**
 * Update group
 */
export const updateGroup = async (id, data) => {
    const response = await api.put(`/groups/${id}`, data);
    return response.data.data;
};

/**
 * Delete group
 */
export const deleteGroup = async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
};

/**
 * Add member to group
 */
export const addMember = async (groupId, userId) => {
    const response = await api.post(`/groups/${groupId}/members`, { userId });
    return response.data.data;
};

/**
 * Remove member from group
 */
export const removeMember = async (groupId, userId) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data.data;
};

/**
 * Get group expenses
 */
export const getGroupExpenses = async (groupId, page = 1, limit = 10) => {
    const response = await api.get(`/expenses/group/${groupId}`, {
        params: { page, limit },
    });
    return response.data.data;
};

export default {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    getGroupExpenses,
};
