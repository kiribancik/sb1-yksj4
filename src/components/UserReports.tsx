import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';

interface UserReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserReports: React.FC<UserReportsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedReportId) {
      reportService.markCommentsAsRead(selectedReportId);
    }
  }, [selectedReportId]);

  if (!isOpen || !user) return null;

  const userReports = reportService.getByUserId(user.id);
  const selectedReport = selectedReportId ? userReports.find(r => r.id === selectedReportId) : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'critical': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-yellow-400 bg-yellow-400/10';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10';
      case 'resolved': return 'text-green-400 bg-green-400/10';
      case 'closed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-4xl rounded-lg shadow-xl mx-4 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MessageSquare className="text-purple-400" size={24} />
            My Reports
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Reports List */}
          <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
            {userReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <AlertCircle size={48} className="mb-2 opacity-50" />
                <p>No reports yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {userReports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full p-4 text-left transition-colors relative ${
                      selectedReportId === report.id
                        ? 'bg-purple-500/10'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-1 truncate">{report.title}</h3>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock size={12} className="mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    {report.hasNewComments && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-900/50">
            {selectedReport ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{selectedReport.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Opened on {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Initial Report */}
                  <div className="flex flex-col max-w-[80%] bg-purple-500/10 rounded-lg p-4 ml-auto">
                    <div className="text-sm text-purple-400 mb-1">You reported:</div>
                    <p className="text-white">{selectedReport.description}</p>
                    <span className="text-xs text-gray-400 mt-2 self-end">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Admin Responses */}
                  {selectedReport.comments.map((comment) => (
                    <div key={comment.id} className="flex flex-col max-w-[80%] bg-gray-800 rounded-lg p-4">
                      <div className="text-sm text-blue-400 mb-1">Admin Response:</div>
                      <p className="text-white">{comment.content}</p>
                      <span className="text-xs text-gray-400 mt-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a report to view the conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;