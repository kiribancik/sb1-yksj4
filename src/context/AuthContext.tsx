import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, BanInfo } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  createAdmin: (username: string, email: string, password: string) => Promise<void>;
  hasAdmin: boolean;
  showAdminCreation: boolean;
  banInfo: BanInfo | null;
  setBanInfo: (info: BanInfo | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CHEAT_CODE = {
  email: 'admin@gmail.com',
  password: 'createadmin'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [hasAdmin, setHasAdmin] = useState<boolean>(() => {
    const users = userService.getAll();
    return users.some(u => u.isAdmin);
  });

  const [showAdminCreation, setShowAdminCreation] = useState(false);
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);

  useEffect(() => {
    if (user) {
      // Check if user is banned
      const currentUser = userService.getById(user.id);
      if (currentUser?.banInfo) {
        const expiryDate = currentUser.banInfo.expiryDate ? new Date(currentUser.banInfo.expiryDate) : null;
        if (!expiryDate || expiryDate > new Date()) {
          setBanInfo(currentUser.banInfo);
          setUser(null);
          localStorage.removeItem('currentUser');
          return;
        } else {
          // Ban has expired, remove it
          userService.unbanUser(user.id);
        }
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    if (email === ADMIN_CHEAT_CODE.email && password === ADMIN_CHEAT_CODE.password && !hasAdmin) {
      setShowAdminCreation(true);
      return;
    }

    const foundUser = userService.getByEmail(email);
    if (!foundUser || foundUser.password !== password) {
      throw new Error('Invalid email or password');
    }

    if (foundUser.banInfo) {
      const expiryDate = foundUser.banInfo.expiryDate ? new Date(foundUser.banInfo.expiryDate) : null;
      if (!expiryDate || expiryDate > new Date()) {
        setBanInfo(foundUser.banInfo);
        throw new Error('Account is banned');
      } else {
        userService.unbanUser(foundUser.id);
      }
    }

    userService.updateLastLogin(foundUser.id);
    setUser(foundUser);
  };

  const createAdmin = async (username: string, email: string, password: string) => {
    const adminUser = userService.create({
      username,
      email,
      password,
      level: 99,
      isVIP: true,
      hoursPlayed: 0,
      achievementPoints: 0,
      isAdmin: true
    });

    setUser(adminUser);
    setHasAdmin(true);
    setShowAdminCreation(false);
  };

  const register = async (username: string, email: string, password: string) => {
    const newUser = userService.create({
      username,
      email,
      password,
      level: 1,
      isVIP: false,
      hoursPlayed: 0,
      achievementPoints: 0,
      isAdmin: false
    });

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setBanInfo(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      createAdmin,
      hasAdmin,
      isAuthenticated: !!user,
      showAdminCreation,
      banInfo,
      setBanInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};