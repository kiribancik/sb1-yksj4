import { User, BanInfo } from '../types';
import { fileStorage } from './fileStorage';
import { generateId } from '../utils/helpers';

const USERS_FILE = 'users.json';

export const userService = {
  getAll: (): User[] => {
    return fileStorage.read<User[]>(USERS_FILE, []);
  },

  getById: (id: string): User | undefined => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    return users.find(user => user.id === id);
  },

  getByEmail: (email: string): User | undefined => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    return users.find(user => user.email === email);
  },

  create: (userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): User => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already taken');
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    fileStorage.write(USERS_FILE, users);

    return newUser;
  },

  update: (id: string, userData: Partial<User>): User => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      id // Ensure ID cannot be changed
    };

    users[index] = updatedUser;
    fileStorage.write(USERS_FILE, users);

    return updatedUser;
  },

  delete: (id: string): void => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    const filteredUsers = users.filter(user => user.id !== id);
    fileStorage.write(USERS_FILE, filteredUsers);
  },

  updateLastLogin: (id: string): void => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
      users[index].lastLoginAt = new Date().toISOString();
      fileStorage.write(USERS_FILE, users);
    }
  },

  banUser: (userId: string, banInfo: BanInfo): void => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
      throw new Error('User not found');
    }

    users[index].banInfo = banInfo;
    fileStorage.write(USERS_FILE, users);
  },

  unbanUser: (userId: string): void => {
    const users = fileStorage.read<User[]>(USERS_FILE, []);
    const index = users.findIndex(user => user.id === userId);

    if (index === -1) {
      throw new Error('User not found');
    }

    delete users[index].banInfo;
    fileStorage.write(USERS_FILE, users);
  }
};