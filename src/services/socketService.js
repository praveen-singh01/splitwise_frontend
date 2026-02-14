import io from 'socket.io-client';

/**
 * Socket Service
 * Manages Socket.IO connection and events
 */

let socket = null;

/**
 * Connect to Socket.IO server
 */
export const connect = (token) => {
    if (socket?.connected) {
        return socket;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007';

    socket = io(API_URL, {
        auth: {
            token,
        },
    });

    socket.on('connected', (data) => {
        console.log('✓ Socket connected:', data.message);
    });

    socket.on('connect_error', (error) => {
        console.error('✗ Socket connection error:', error.message);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
    });

    return socket;
};

/**
 * Disconnect from Socket.IO server
 */
export const disconnect = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Listen for new expense events
 */
export const onExpenseNew = (callback) => {
    if (socket) {
        socket.on('expense:new', callback);
    }
};

/**
 * Listen for balance updated events
 */
export const onBalanceUpdated = (callback) => {
    if (socket) {
        socket.on('balance:updated', callback);
    }
};

/**
 * Remove expense:new listener
 */
export const offExpenseNew = () => {
    if (socket) {
        socket.off('expense:new');
    }
};

/**
 * Remove balance:updated listener
 */
export const offBalanceUpdated = () => {
    if (socket) {
        socket.off('balance:updated');
    }
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;

/**
 * Check if socket is connected
 */
export const isConnected = () => socket?.connected || false;

export default {
    connect,
    disconnect,
    onExpenseNew,
    onBalanceUpdated,
    offExpenseNew,
    offBalanceUpdated,
    getSocket,
    isConnected,
};
