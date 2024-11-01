import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import News from './components/News';
import AdminDashboard from './components/AdminDashboard';
import ReportModal from './components/ReportModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar 
        onReport={() => setIsReportModalOpen(true)} 
        onToggleAdmin={() => setShowAdminPanel(!showAdminPanel)}
        showAdminPanel={showAdminPanel}
      />
      
      {showAdminPanel && user?.isAdmin ? (
        <div className="pt-16">
          <AdminDashboard />
        </div>
      ) : (
        <>
          <Hero />
          <Stats />
          <News />
        </>
      )}
      
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;