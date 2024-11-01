import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import { Message, User } from '../types';

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
}

const Messages: React.FC<MessagesProps> = ({ isOpen, onClose }) => {
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen && currentUser) {
      const allUsers = userService.getAll().filter(u => u.id !== currentUser.id);
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const conversation = messageService.getConversation(currentUser.id, selectedUser.id);
      setMessages(conversation);
      messageService.markAllAsRead(currentUser.id);
      scrollToBottom();
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const filtered = users.filter(u => 
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser || !selectedUser) return;

    const newMessage = messageService.send(currentUser.id, selectedUser.id, messageText);
    setMessages([...messages, newMessage]);
    setMessageText('');
    scrollToBottom();
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-4xl h-[80vh] rounded-lg shadow-xl mx-4 flex">
        {/* Users List */}
        <div className="w-1/3 border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(80vh-73px)]">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 text-left hover:bg-gray-800/50 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-purple-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-sm text-gray-400">Level {user.level}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            {selectedUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedUser.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{selectedUser.username}</p>
                  <p className="text-sm text-gray-400">Level {selectedUser.level}</p>
                </div>
              </div>
            ) : (
              <span className="text-gray-400">Select a user to start chatting</span>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedUser ? (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.fromUserId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.fromUserId === currentUser.id
                        ? 'bg-purple-500/20 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a user to view conversation
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedUser && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;