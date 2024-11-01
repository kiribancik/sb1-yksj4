import { storage } from '../utils/storage';

const STORAGE_PREFIX = 'crmp_';

export const fileStorage = {
  read: <T>(filename: string, defaultValue: T): T => {
    // Ensure filename ends with .json
    const key = filename.endsWith('.json') ? filename : `${filename}.json`;
    return storage.read<T>(`${STORAGE_PREFIX}${key}`, defaultValue);
  },

  write: <T>(filename: string, data: T): void => {
    // Ensure filename ends with .json
    const key = filename.endsWith('.json') ? filename : `${filename}.json`;
    storage.write(`${STORAGE_PREFIX}${key}`, data);
  }
};