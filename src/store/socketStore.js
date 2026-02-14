import { create } from 'zustand';
import socketService from '../services/socketService';

const useSocketStore = create((set, get) => ({
    connected: false,
    socket: null,

    /**
     * Connect to Socket.IO
     */
    connect: (token) => {
        const socket = socketService.connect(token);

        socket.on('connect', () => {
            set({ connected: true, socket });
        });

        socket.on('disconnect', () => {
            set({ connected: false });
        });

        set({ socket });
    },

    /**
     * Disconnect from Socket.IO
     */
    disconnect: () => {
        socketService.disconnect();
        set({ connected: false, socket: null });
    },

    /**
     * Setup event listeners
     */
    setupListeners: (onExpenseNew, onBalanceUpdated) => {
        socketService.onExpenseNew(onExpenseNew);
        socketService.onBalanceUpdated(onBalanceUpdated);
    },

    /**
     * Remove event listeners
     */
    removeListeners: () => {
        socketService.offExpenseNew();
        socketService.offBalanceUpdated();
    },
}));

export default useSocketStore;
