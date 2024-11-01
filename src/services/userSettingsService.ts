import { UserSettings } from '../types';
import { fileStorage } from './fileStorage';

const SETTINGS_FILE = 'user_settings.json';

export const userSettingsService = {
  get: (userId: string): UserSettings => {
    const settings = fileStorage.read<Record<string, UserSettings>>(SETTINGS_FILE, {});
    return settings[userId] || {
      theme: 'dark',
      notifications: true,
      language: 'en',
      privacy: {
        showOnline: true,
        showProfile: true
      }
    };
  },

  update: (userId: string, settings: Partial<UserSettings>): UserSettings => {
    const allSettings = fileStorage.read<Record<string, UserSettings>>(SETTINGS_FILE, {});
    const currentSettings = allSettings[userId] || userSettingsService.get(userId);
    
    allSettings[userId] = {
      ...currentSettings,
      ...settings,
      privacy: {
        ...currentSettings.privacy,
        ...(settings.privacy || {})
      }
    };

    fileStorage.write(SETTINGS_FILE, allSettings);
    return allSettings[userId];
  }
};