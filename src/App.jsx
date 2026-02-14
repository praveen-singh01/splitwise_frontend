import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import Balances from './pages/Balances';
import Subscription from './pages/Subscription';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import useAuthStore from './store/authStore';
import useSocketStore from './store/socketStore';
import useSubscriptionStore from './store/subscriptionStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const { connect, disconnect } = useSocketStore();
  const { fetchStatus } = useSubscriptionStore();

  // Connect socket and fetch subscription status on auth
  useEffect(() => {
    if (isAuthenticated && token) {
      // Connect Socket.IO
      connect(token);

      // Fetch subscription status
      fetchStatus();

      return () => {
        disconnect();
      };
    }
  }, [isAuthenticated, token, connect, disconnect, fetchStatus]);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/new"
            element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/:id/edit"
            element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/balances"
            element={
              <ProtectedRoute>
                <Balances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:id"
            element={
              <ProtectedRoute>
                <GroupDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
