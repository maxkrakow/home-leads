import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

// Wrapper component to conditionally render Header and Footer
const AppLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
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