import React, { useState } from 'react';
import { Save, RefreshCw, Database, Plus, Pencil, Trash2, Pin, X, Image, Newspaper } from 'lucide-react';
import { userService } from '../../services/userService';
import { reportService } from '../../services/reportService';
import { statisticsService } from '../../services/statisticsService';
import { newsService } from '../../services/newsService';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const AdminSettings = () => {
  const { user } = useAuth();
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null
  });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });

  const [news, setNews] = useState(() => newsService.getAll());

  const handleExportData = () => {
    const data = {
      users: userService.getAll(),
      reports: reportService.getAll(),
      statistics: statisticsService.get(),
      news: newsService.getAll()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crmp_backup_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetNewsForm = () => {
    setFormData({ title: '', content: '', image: '' });
    setEditingId(null);
    setShowNewsForm(false);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      newsService.update(editingId, {
        ...formData,
        authorId: user!.id,
        authorName: user!.username
      });
    } else {
      newsService.create({
        ...formData,
        authorId: user!.id,
        authorName: user!.username,
        pinned: false
      });
    }

    setNews(newsService.getAll());
    resetNewsForm();
  };

  const handleEditNews = (id: string) => {
    const item = newsService.getById(id);
    if (item) {
      setFormData({
        title: item.title,
        content: item.content,
        image: item.image
      });
      setEditingId(id);
      setShowNewsForm(true);
    }
  };

  const handleDeleteNews = (id: string) => {
    newsService.delete(id);
    setNews(newsService.getAll());
    setShowDeleteModal({ show: false, id: null });
  };

  const handleTogglePin = (id: string) => {
    newsService.togglePin(id);
    setNews(newsService.getAll());
  };

  return (
    <div className="space-y-6">
      {/* Data Management Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2"
          >
            <Database size={20} />
            Export Database
          </button>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Sync Data
          </button>
        </div>
      </div>

      {/* News Management Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Newspaper size={20} className="text-purple-400" />
            News Management
          </h3>
          <button
            onClick={() => setShowNewsForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            Add News
          </button>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{item.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {item.authorName}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePin(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.pinned
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-800 text-gray-400 hover:text-yellow-400'
                    }`}
                    title={item.pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin size={20} />
                  </button>
                  <button
                    onClick={() => handleEditNews(item.id)}
                    className="p-2 bg-gray-800 text-gray-400 hover:text-purple-400 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal({ show: true, id: item.id })}
                    className="p-2 bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Form Modal */}
      {showNewsForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit News' : 'Add News'}
              </h2>
              <button onClick={resetNewsForm} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2"
                    onClick={() => window.open(formData.image, '_blank')}
                    disabled={!formData.image}
                  >
                    <Image size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[200px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetNewsForm}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  {editingId ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal.show}
        onClose={() => setShowDeleteModal({ show: false, id: null })}
        onConfirm={() => showDeleteModal.id && handleDeleteNews(showDeleteModal.id)}
        title="Delete News"
        message="Are you sure you want to delete this news item? This action cannot be undone."
      />

      {/* Server Settings Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Server Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Players
            </label>
            <input
              type="number"
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none"
              defaultValue={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Server Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-purple-500 focus:outline-none"
              defaultValue="CRMP Mobile Official"
            />
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;