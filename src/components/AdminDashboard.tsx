import React, { useState } from 'react';
import { Users, FileText, BarChart2, Shield, Activity, Clock, Award, Settings, ChevronRight, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { reportService } from '../services/reportService';
import { statisticsService } from '../services/statisticsService';
import ReportDetails from './admin/ReportDetails';
import UsersList from './admin/UsersList';
import AdminSettings from './admin/AdminSettings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const stats = statisticsService.get();
  const reports = reportService.getAll();
  const users = userService.getAll();
  const activeReports = reports.filter(r => r.status === 'open').length;
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!user?.isAdmin) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'users':
        return <UsersList users={users} />;
      case 'reports':
        return <ReportDetails reports={reports} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Users className="text-purple-400" size={20} />
                  </div>
                  <span className="text-gray-400">Total Users</span>
                </div>
                <p className="text-3xl font-bold text-white">{users.length}</p>
                <p className="text-sm text-purple-400 mt-2">+12% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <FileText className="text-blue-400" size={20} />
                  </div>
                  <span className="text-gray-400">Active Reports</span>
                </div>
                <p className="text-3xl font-bold text-white">{activeReports}</p>
                <p className="text-sm text-blue-400 mt-2">5 new today</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Activity className="text-green-400" size={20} />
                  </div>
                  <span className="text-gray-400">Online Users</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                <p className="text-sm text-green-400 mt-2">Active now</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <Clock className="text-orange-400" size={20} />
                  </div>
                  <span className="text-gray-400">Total Play Time</span>
                </div>
                <p className="text-3xl font-bold text-white">{Math.round(stats.totalPlayTime / 60)}h</p>
                <p className="text-sm text-orange-400 mt-2">Across all users</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText size={20} className="text-purple-400" />
                    Recent Reports
                  </h3>
                  <button 
                    onClick={() => setSelectedTab('reports')}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {reports.slice(0, 5).map(report => (
                    <div 
                      key={report.id} 
                      onClick={() => setSelectedTab('reports')}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors cursor-pointer group"
                    >
                      <div>
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{report.title}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === 'open' ? 'bg-yellow-500/20 text-yellow-300' :
                        report.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award size={20} className="text-purple-400" />
                    Top Players
                  </h3>
                  <button 
                    onClick={() => setSelectedTab('users')}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user, index) => (
                    <div 
                      key={user.id} 
                      onClick={() => setSelectedTab('users')}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{user.username}</p>
                          <p className="text-sm text-gray-400">Level {user.level}</p>
                        </div>
                      </div>
                      {user.isVIP && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                          VIP
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg border border-purple-500/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Shield className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
                <p className="text-sm text-gray-400">Welcome back, {user.username}</p>
              </div>
            </div>
            <button className="relative p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;