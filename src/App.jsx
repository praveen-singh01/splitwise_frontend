import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import Balances from './pages/Balances';
import useAuthStore from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
