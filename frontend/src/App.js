// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- STATE PROVIDERS ---
import AuthState from './context/auth/AuthState';
import ReceiptState from './context/receipt/ReceiptState';
import BudgetState from './context/budget/BudgetState';
import CategoryState from './context/category/CategoryState';
import RecurringState from './context/recurring/RecurringState';
import FundState from './context/funds/FundState';
import GoalState from './context/goals/GoalState';
import AuthContext from './context/auth/authContext';
import FundsPage from './pages/FundsPage';

// --- LAYOUT, PAGES, & COMPONENTS ---
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import BudgetPage from './pages/BudgetPage';
import RecurringPage from './pages/RecurringPage';
import GoalsPage from './pages/GoalsPage'; // <-- THE MISSING IMPORT

// --- Loading Spinner ---
const AppLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner"></div>
  </div>
);

// --- Main App Component ---
function App() {
  return (
    <AuthState>
      <ReceiptState>
        <FundState>
        <BudgetState>
          <CategoryState>
            <RecurringState>
              <GoalState>
                <Router>
                  <Toaster position="top-right" />
                  <AppRoutes />
                </Router>
              </GoalState>
            </RecurringState>
          </CategoryState>
        </BudgetState>
        </FundState>
      </ReceiptState>
    </AuthState>
  );
}

// --- Routing Logic ---
const AppRoutes = () => {
  const { initialized } = useContext(AuthContext);

  if (!initialized) {
    return <AppLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="budgets" element={<BudgetPage />} />
        <Route path="recurring" element={<RecurringPage />} />
        {/* --- THIS IS THE MISSING ROUTE --- */}
        <Route path="goals" element={<GoalsPage />} />
        <Route path="funds" element={<FundsPage />} />
      </Route>
    </Routes>
  );
};

export default App;