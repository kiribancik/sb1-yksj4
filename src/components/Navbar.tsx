import React, { useState, useEffect } from 'react';
import { Menu, Search, User, Shield, Flag, LogOut, MessageSquare, Bell } from 'lucide-react';
import SearchModal from './SearchModal';
import ProfileModal from './ProfileModal';
import AuthModal from './AuthModal';
import AdminCreationModal from './AdminCreationModal';
import UserReports from './UserReports';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { messageService } from '../services/messageService';

interface NavbarProps {
  onReport: () => void;
  onToggleAdmin: () => void;
  showAdminPanel: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onReport, onToggleAdmin, showAdminPanel }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminCreationOpen, setIsAdminCreationOpen] = useState(false);
  const [isUserReportsOpen, setIsUserReportsOpen] = useState(false);
  const [unreadReports, setUnreadReports] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      const reportCount = reportService.getUnreadCount(user.id, !!user.isAdmin);
      const messageCount = messageService.getUnreadCount(user.id);
      setUnreadReports(reportCount);
      setUnreadMessages(messageCount);
    }
  }, [user]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (user?.id === 'temp-admin') {
        setIsAdminCreationOpen(true);
      } else {
        setIsProfileOpen(true);
      }
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    if (showAdminPanel) {
      onToggleAdmin();
    }
  };

  const handleReportsClick = () => {
    setIsUserReportsOpen(true);
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">CRMP Mobile</span>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <a href="#about" className="text-gray-300 hover:text-white px-3 py-2">About</a>
                  <a href="#news" className="text-gray-300 hover:text-white px-3 py-2">News</a>
                  <a href="#guides" className="text-gray-300 hover:text-white px-3 py-2">Guides</a>
                  <a href="#download" className="text-gray-300 hover:text-white px-3 py-2">Download</a>
                  <a href="#forum" className="text-gray-300 hover:text-white px-3 py-2">Forum</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  <button 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={onReport}
                    title="Submit Report"
                  >
                    <Flag size={20} />
                  </button>
                  <div className="relative">
                    <button 
                      className={`text-gray-300 hover:text-white transition-colors ${
                        unreadReports > 0 ? 'text-purple-400' : ''
                      }`}
                      onClick={handleReportsClick}
                      title="My Reports"
                    >
                      <MessageSquare size={20} />
                    </button>
                    {unreadReports > 0 && !user?.isAdmin && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                        {unreadReports}
                      </span>
                    )}
                  </div>
                  {user?.isAdmin && (
                    <div className="relative">
                      <button 
                        className={`text-gray-300 hover:text-white transition-colors ${showAdminPanel ? 'text-purple-500' : ''}`}
                        onClick={onToggleAdmin}
                        title="Admin Panel"
                      >
                        <Shield size={20} />
                      </button>
                      {unreadReports > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                          {unreadReports}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="relative">
                    <button 
                      className={`text-gray-300 hover:text-white transition-colors ${
                        unreadMessages > 0 ? 'text-purple-400' : ''
                      }`}
                      onClick={handleProfileClick}
                      title="Messages"
                    >
                      <Bell size={20} />
                    </button>
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                        {unreadMessages}
                      </span>
                    )}
                  </div>
                </>
              )}
              <button 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>
              <button 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={handleProfileClick}
              >
                <User size={20} />
              </button>
              {isAuthenticated && (
                <button 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              )}
              <button className="md:hidden text-gray-300 hover:text-white">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AdminCreationModal isOpen={isAdminCreationOpen} onClose={() => setIsAdminCreationOpen(false)} />
      <UserReports 
        isOpen={isUserReportsOpen} 
        onClose={() => {
          setIsUserReportsOpen(false);
          setUnreadReports(0);
        }} 
      />
    </>
  );
};

export default Navbar;