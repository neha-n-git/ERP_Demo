import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './components/AdminLayout';

// Pages
import PublicRegister from './pages/PublicRegister';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StartupRegistry from './pages/StartupRegistry';
import StartupDetail from './pages/StartupDetail';
import PeopleRegistry from './pages/PeopleRegistry';
import ResourceTracker from './pages/ResourceTracker';
import PaymentsTracker from './pages/PaymentsTracker';
import SupportContact from './pages/SupportContact';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<PublicRegister />} />
      
      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="startups" element={<StartupRegistry />} />
        <Route path="startups/:id" element={<StartupDetail />} />
        <Route path="people" element={<PeopleRegistry />} />
        <Route path="resources" element={<ResourceTracker />} />
        <Route path="payments" element={<PaymentsTracker />} />
        <Route path="support" element={<SupportContact />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/register" />} />
    </Routes>
  );
};

export default App;
