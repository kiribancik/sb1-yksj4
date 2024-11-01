// Existing types...

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
  language: string;
  privacy: {
    showOnline: boolean;
    showProfile: boolean;
  };
}