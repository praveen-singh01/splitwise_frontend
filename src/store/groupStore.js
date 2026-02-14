import { create } from 'zustand';
import groupService from '../services/groupService';

const useGroupStore = create((set) => ({
    groups: [],
    currentGroup: null,
    loading: false,
    error: null,

    /**
     * Fetch all groups
     */
    fetchGroups: async () => {
        set({ loading: true, error: null });
        try {
            const groups = await groupService.getGroups();
            set({ groups, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch groups',
                loading: false,
            });
        }
    },

    /**
     * Fetch group by ID
     */
    fetchGroupById: async (id) => {
        set({ loading: true, error: null });
        try {
            const group = await groupService.getGroupById(id);
            set({ currentGroup: group, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch group',
                loading: false,
            });
        }
    },

    /**
     * Create new group
     */
    createGroup: async (data) => {
        set({ loading: true, error: null });
        try {
            const newGroup = await groupService.createGroup(data);
            set((state) => ({
                groups: [...state.groups, newGroup],
                loading: false,
            }));
            return newGroup;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create group',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Update group
     */
    updateGroup: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedGroup = await groupService.updateGroup(id, data);
            set((state) => ({
                groups: state.groups.map((g) => (g._id === id ? updatedGroup : g)),
                currentGroup: state.currentGroup?._id === id ? updatedGroup : state.currentGroup,
                loading: false,
            }));
            return updatedGroup;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update group',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Delete group
     */
    deleteGroup: async (id) => {
        set({ loading: true, error: null });
        try {
            await groupService.deleteGroup(id);
            set((state) => ({
                groups: state.groups.filter((g) => g._id !== id),
                currentGroup: state.currentGroup?._id === id ? null : state.currentGroup,
                loading: false,
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete group',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Add member to group
     */
    addMember: async (groupId, userId) => {
        set({ loading: true, error: null });
        try {
            const updatedGroup = await groupService.addMember(groupId, userId);
            set((state) => ({
                groups: state.groups.map((g) => (g._id === groupId ? updatedGroup : g)),
                currentGroup: state.currentGroup?._id === groupId ? updatedGroup : state.currentGroup,
                loading: false,
            }));
            return updatedGroup;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to add member',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Remove member from group
     */
    removeMember: async (groupId, userId) => {
        set({ loading: true, error: null });
        try {
            const updatedGroup = await groupService.removeMember(groupId, userId);
            set((state) => ({
                groups: state.groups.map((g) => (g._id === groupId ? updatedGroup : g)),
                currentGroup: state.currentGroup?._id === groupId ? updatedGroup : state.currentGroup,
                loading: false,
            }));
            return updatedGroup;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to remove member',
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Clear current group
     */
    clearCurrentGroup: () => set({ currentGroup: null }),

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),
}));

export default useGroupStore;
