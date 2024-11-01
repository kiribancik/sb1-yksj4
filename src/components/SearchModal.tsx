import React from 'react';
import { X, Search as SearchIcon } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl p-4 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Search</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for guides, news, or forum posts..."
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            autoFocus
          />
          <SearchIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Links</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded">
              Beginner's Guide
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded">
              Latest Updates
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded">
              Popular Forum Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;