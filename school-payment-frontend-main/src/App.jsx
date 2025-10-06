import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import CreatePayment from './pages/CreatePayment';
import TransactionStatus from './pages/TransactionStatus';
import PaymentCallback from './pages/PaymentCallback';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          
          {/* Protected Routes - Require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-payment"
            element={
              <ProtectedRoute>
                <CreatePayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-status"
            element={
              <ProtectedRoute>
                <TransactionStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-callback"
            element={
              <ProtectedRoute>
                <PaymentCallback />
              </ProtectedRoute>
            }
          />
          
          {/* Root route - Redirect based on auth status */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;