import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

interface BanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  fromReport?: boolean;
  reportContent?: string;
}

const BanModal: React.FC<BanModalProps> = ({ isOpen, onClose, userId, username, fromReport, reportContent }) => {
  const { user: admin } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    reason: fromReport ? 'Inappropriate behavior in report' : '',
    duration: '24h',
    customDuration: ''
  });

  if (!isOpen || !admin?.isAdmin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let expiryDate: string | null = null;
      
      if (formData.duration !== 'permanent') {
        const now = new Date();
        if (formData.duration === 'custom') {
          const hours = parseInt(formData.customDuration);
          if (isNaN(hours) || hours <= 0) {
            setError('Please enter a valid duration');
            return;
          }
          expiryDate = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
        } else {
          const hours = parseInt(formData.duration);
          expiryDate = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
        }
      }

      userService.banUser(userId, {
        bannedBy: admin.username,
        reason: formData.reason,
        banDate: new Date().toISOString(),
        expiryDate
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-md rounded-lg shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Ban User: {username}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {fromReport && reportContent && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Report Content:</h3>
            <p className="text-white">{reportContent}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Ban Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="24h">24 Hours</option>
              <option value="72h">3 Days</option>
              <option value="168h">1 Week</option>
              <option value="720h">1 Month</option>
              <option value="permanent">Permanent</option>
              <option value="custom">Custom Duration</option>
            </select>
          </div>

          {formData.duration === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Custom Duration (hours)
              </label>
              <input
                type="number"
                value={formData.customDuration}
                onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter hours"
                min="1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Ban Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[100px]"
              placeholder="Enter the reason for the ban"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium transition-colors"
          >
            Ban User
          </button>
        </form>
      </div>
    </div>
  );
};

export default BanModal;