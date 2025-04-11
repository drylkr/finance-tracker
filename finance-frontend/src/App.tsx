import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import MainLayout from './components/layout/MainLayout';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Add explicit root route that redirects */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes inside MainLayout */}
        {isAuthenticated ? (
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;