import React, { useState } from 'react';
import { Report } from '../../types';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Ban, User } from 'lucide-react';
import BanModal from '../BanModal';

interface ReportDetailsProps {
  reports: Report[];
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ reports }) => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);

  const handleStatusChange = (reportId: string, status: Report['status']) => {
    reportService.update(reportId, { status });
    setSelectedReport(prev => prev ? { ...prev, status } : null);
  };

  const handleReply = (reportId: string) => {
    if (!replyText.trim()) return;
    
    reportService.addComment(reportId, user!.id, replyText);
    setReplyText('');
    
    const updatedReport = reportService.getById(reportId);
    setSelectedReport(updatedReport || null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">All Reports</h3>
          <div className="space-y-3">
            {reports.map(report => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'bg-purple-500/20 border border-purple-500/40'
                    : 'bg-gray-900/50 hover:bg-gray-900/80 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{report.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'open' ? 'bg-yellow-500/20 text-yellow-300' :
                    report.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{report.username}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{report.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Type: {report.type}</span>
                  <span>Priority: {report.priority}</span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Details */}
        {selectedReport ? (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{selectedReport.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{selectedReport.username}</span>
                  </div>
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Ban size={14} />
                    Ban User
                  </button>
                </div>
              </div>
              <select
                value={selectedReport.status}
                onChange={(e) => handleStatusChange(selectedReport.id, e.target.value as Report['status'])}
                className="bg-gray-900 text-white rounded-lg px-3 py-1 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-300">{selectedReport.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Reported on {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
              </div>

              {selectedReport.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-purple-400" />
                    <span className="text-sm text-purple-400">Admin Response</span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={() => handleReply(selectedReport.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Send size={16} />
                Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex items-center justify-center text-gray-400">
            Select a report to view details
          </div>
        )}
      </div>

      {selectedReport && (
        <BanModal
          isOpen={showBanModal}
          onClose={() => setShowBanModal(false)}
          userId={selectedReport.userId}
          username={selectedReport.username}
          fromReport={true}
          reportContent={selectedReport.description}
        />
      )}
    </>
  );
};

export default ReportDetails;