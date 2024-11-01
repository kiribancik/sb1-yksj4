import React from 'react';
import { X, User as UserIcon, Trophy, Star, Clock, Settings } from 'lucide-react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onSettingsClick: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onSettingsClick }) => {
  return (
    <div className="bg-gray-900 w-full max-w-md h-full shadow-xl p-6 animate-slide-left">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onSettingsClick}
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
          <UserIcon size={48} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{user.username}</h3>
        <p className="text-gray-400">
          {user.isVIP ? 'VIP Member' : 'Regular Member'} • Level {user.level}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
          <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Trophy className="text-purple-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{user.level}</p>
          <p className="text-sm text-gray-400">Level</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
          <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Star className="text-purple-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{user.achievementPoints}</p>
          <p className="text-sm text-gray-400">Points</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg text-center">
          <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="text-purple-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{user.hoursPlayed}h</p>
          <p className="text-sm text-gray-400">Played</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Email</h4>
          <p className="text-white">{user.email}</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Member Since</h4>
          <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Last Login</h4>
          <p className="text-white">{new Date(user.lastLoginAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;