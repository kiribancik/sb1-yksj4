import React, { useState } from 'react';
import { newsService } from '../../services/newsService';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, Pin, X, Image } from 'lucide-react';

const NewsManager = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });

  const news = newsService.getAll();

  const resetForm = () => {
    setFormData({ title: '', content: '', image: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    resetForm();
  };

  const handleEdit = (id: string) => {
    const item = newsService.getById(id);
    if (item) {
      setFormData({
        title: item.title,
        content: item.content,
        image: item.image
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      newsService.delete(id);
    }
  };

  const handleTogglePin = (id: string) => {
    newsService.togglePin(id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">News Management</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            Add News
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl p-6 mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit News' : 'Add News'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onClick={resetForm}
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
                    onClick={() => handleEdit(item.id)}
                    className="p-2 bg-gray-800 text-gray-400 hover:text-purple-400 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default NewsManager;