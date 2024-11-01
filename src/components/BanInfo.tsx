import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { BanInfo as BanInfoType } from '../types';

interface BanInfoProps {
  isOpen: boolean;
  onClose: () => void;
  banInfo: BanInfoType;
}

const BanInfo: React.FC<BanInfoProps> = ({ isOpen, onClose, banInfo }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = () => {
    if (!banInfo.expiryDate) return 'Permanent';
    
    const banDate = new Date(banInfo.banDate);
    const expiryDate = new Date(banInfo.expiryDate);
    const hours = Math.round((expiryDate.getTime() - banDate.getTime()) / (1000 * 60 * 60));
    
    if (hours < 24) return `${hours} hours`;
    if (hours === 24) return '1 day';
    if (hours < 168) return `${Math.round(hours / 24)} days`;
    if (hours < 720) return `${Math.round(hours / 168)} weeks`;
    return `${Math.round(hours / 720)} months`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-md rounded-lg shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-semibold">Account Banned</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="py-3 text-gray-400">Banned By</td>
                <td className="py-3 text-white font-medium">{banInfo.bannedBy}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-400">Ban Date</td>
                <td className="py-3 text-white">{formatDate(banInfo.banDate)}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-400">Duration</td>
                <td className="py-3 text-white">{formatDuration()}</td>
              </tr>
              {banInfo.expiryDate && (
                <tr>
                  <td className="py-3 text-gray-400">Expires On</td>
                  <td className="py-3 text-white">{formatDate(banInfo.expiryDate)}</td>
                </tr>
              )}
              <tr>
                <td className="py-3 text-gray-400">Reason</td>
                <td className="py-3 text-white">{banInfo.reason}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-400 text-sm">
          If you believe this ban was issued in error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default BanInfo;