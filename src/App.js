import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import LeadsPage from './pages/LeadsPage';
import CalendlyAuthCallback from './pages/CalendlyAuthCallback';

// Wrapper component to conditionally render Header and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Don't show header and footer on dashboard or when user is logged in
  const isDashboard = location.pathname === '/dashboard';
  
  return (
    <>
      {!isDashboard && <Header />}
      <main className={isDashboard ? '' : 'flex-1'}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          } />
          <Route path="/login" element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          } />
          <Route path="/signup" element={
            <AppLayout>
              <SignupPage />
            </AppLayout>
          } />
          <Route path="/demo" element={
            <AppLayout>
              <div className="container mx-auto py-24 px-4"><h1 className="text-3xl font-bold mb-4">Schedule a Demo</h1><p>This is a placeholder for the demo scheduling page.</p></div>
            </AppLayout>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/leads" element={
            <PrivateRoute>
              <LeadsPage />
            </PrivateRoute>
          } />
          <Route path="/calendly-auth-callback" element={<CalendlyAuthCallback />} />
          <Route path="*" element={
            <AppLayout>
              <div className="container mx-auto py-24 px-4"><h1 className="text-3xl font-bold mb-4">Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>
            </AppLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 