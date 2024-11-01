import { Message } from '../types';
import { fileStorage } from './fileStorage';
import { generateId } from '../utils/helpers';

const MESSAGES_FILE = 'messages.json';

export const messageService = {
  getAll: (): Message[] => {
    return fileStorage.read<Message[]>(MESSAGES_FILE, []);
  },

  getConversation: (userId1: string, userId2: string): Message[] => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    return messages.filter(msg => 
      (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
      (msg.fromUserId === userId2 && msg.toUserId === userId1)
    );
  },

  getUserMessages: (userId: string): Message[] => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    return messages.filter(msg => 
      msg.toUserId === userId || msg.fromUserId === userId
    );
  },

  getUnreadCount: (userId: string): number => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    return messages.filter(msg => msg.toUserId === userId && !msg.isRead).length;
  },

  send: (fromUserId: string, toUserId: string, content: string): Message => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    
    const newMessage: Message = {
      id: generateId(),
      fromUserId,
      toUserId,
      content,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    messages.push(newMessage);
    fileStorage.write(MESSAGES_FILE, messages);

    return newMessage;
  },

  markAsRead: (messageId: string): void => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    const index = messages.findIndex(msg => msg.id === messageId);
    
    if (index !== -1) {
      messages[index].isRead = true;
      fileStorage.write(MESSAGES_FILE, messages);
    }
  },

  markAllAsRead: (userId: string): void => {
    const messages = fileStorage.read<Message[]>(MESSAGES_FILE, []);
    const updated = messages.map(msg => {
      if (msg.toUserId === userId && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    fileStorage.write(MESSAGES_FILE, updated);
  }
};