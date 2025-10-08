import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import Splash from '@/components/Splash';
import Auth from '@/components/Auth';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import Budgets from '@/components/Budgets';
import Reports from '@/components/Reports';

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'budgets' | 'reports'>('dashboard');
  const { isAuthenticated, loading } = useApp();

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'budgets' && <Budgets />}
      {currentPage === 'reports' && <Reports />}
    </Layout>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
