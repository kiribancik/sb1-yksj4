import React, { useState } from 'react';
import { X, Settings, LogOut, User as UserIcon, MessageSquare, Trophy, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userSettingsService } from '../services/userSettingsService';
import Messages from './Messages';
import UserAchievements from './UserAchievements';
import UserSettings from './UserSettings';
import UserProfile from './UserProfile';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'profile' | 'messages' | 'achievements' | 'settings'>('profile');

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'messages':
        return <Messages isOpen={true} onClose={() => setActiveView('profile')} />;
      case 'achievements':
        return <UserAchievements isOpen={true} onClose={() => setActiveView('profile')} />;
      case 'settings':
        return <UserSettings isOpen={true} onClose={() => setActiveView('profile')} />;
      default:
        return (
          <UserProfile 
            user={user} 
            onClose={onClose}
            onSettingsClick={() => setActiveView('settings')}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-end">
      {renderContent()}
    </div>
  );
};

export default ProfileModal;