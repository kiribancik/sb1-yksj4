import React, { useState } from 'react';
import { User } from '../../types';
import { userService } from '../../services/userService';
import { Shield, Star, Clock, Trophy, Ban } from 'lucide-react';
import BanModal from '../BanModal';

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);

  const handleToggleVIP = (userId: string, currentStatus: boolean) => {
    userService.update(userId, { isVIP: !currentStatus });
  };

  const handleToggleAdmin = (userId: string, currentStatus: boolean) => {
    userService.update(userId, { isAdmin: !currentStatus });
  };

  const handleBanClick = (userId: string, username: string) => {
    setSelectedUser({ id: userId, username });
    setShowBanModal(true);
  };

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">User Management</h3>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {user.username}
                      {user.banInfo && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                          Banned
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleBanClick(user.id, user.username)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.banInfo 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-gray-800 text-gray-400 hover:text-red-400'
                    }`}
                    title={user.banInfo ? 'User is banned' : 'Ban user'}
                  >
                    <Ban size={20} />
                  </button>
                  <button
                    onClick={() => handleToggleVIP(user.id, user.isVIP)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isVIP 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-gray-800 text-gray-400 hover:text-purple-400'
                    }`}
                    title={user.isVIP ? 'Remove VIP' : 'Make VIP'}
                  >
                    <Star size={20} />
                  </button>
                  <button
                    onClick={() => handleToggleAdmin(user.id, user.isAdmin || false)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isAdmin 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-gray-800 text-gray-400 hover:text-purple-400'
                    }`}
                    title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  >
                    <Shield size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock size={16} />
                    <span className="text-sm">Hours Played</span>
                  </div>
                  <p className="text-white font-medium">{user.hoursPlayed}h</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Trophy size={16} />
                    <span className="text-sm">Level</span>
                  </div>
                  <p className="text-white font-medium">{user.level}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Star size={16} />
                    <span className="text-sm">Achievement Points</span>
                  </div>
                  <p className="text-white font-medium">{user.achievementPoints}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <BanModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id}
          username={selectedUser.username}
        />
      )}
    </>
  );
};

export default UsersList;