import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import LogoutSuccess from './pages/LogoutSuccess';
import AdminDashboard from './pages/AdminDashboard';
import Maintenance from './pages/Maintenance';
import BookIssue from './pages/BookIssue';
import BookReturn from './pages/BookReturn';
import PayFine from './pages/PayFine';
import Reports from './pages/Reports';
import { ModalProvider } from './context/ModalContext';
import ConfirmModal from './components/ConfirmModal';

const App = () => {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!user) return <Navigate to="/" />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/user-dashboard" />;
    return children;
  };

  return (
    <ModalProvider>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
        
        {/* 
          The Sidebar is securely mounted within the flex-row layout.
          It will not collapse and strictly takes 100vh alongside the main view.
        */}
        {user && <Sidebar />}
        
        <div style={{ flex: 1, overflowY: 'auto', padding: user ? '2rem 3rem' : '0' }}>
          
          {/* Unauthenticated View: Full Screen Centered Layout */}
          {!user && (
            <div style={{ height: '100%', width: '100%' }}>
              <Routes>
                <Route path="/logout-success" element={<LogoutSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/charts" element={<div style={{ padding: '2rem', color: '#fff' }}><h1>System Flowchart Placeholder</h1><p>Visualizing Library Intelligence...</p></div>} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          )}
          
          {/* Authenticated Routes: Standard content rendering inside flex scroll-container */}
          {user && (
            <Routes>
              <Route path="/" element={<Navigate to={user.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard'} />} />
              
              <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/user-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              
              <Route path="/maintenance" element={<ProtectedRoute requiredRole="Admin"><Maintenance /></ProtectedRoute>} />
              
              <Route path="/issue" element={<ProtectedRoute><BookIssue /></ProtectedRoute>} />
              <Route path="/return" element={<ProtectedRoute><BookReturn /></ProtectedRoute>} />
              <Route path="/pay-fine/:id" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />
              
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/charts" element={<ProtectedRoute><div style={{ padding: '2rem', color: '#fff' }}><h1>System Intelligence Dashboard</h1><p>Real-time analytics...</p></div></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      
        <ConfirmModal />
      </div>
    </ModalProvider>
  );
};

export default App;
