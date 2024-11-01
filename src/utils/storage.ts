interface StorageOptions {
  pretty?: boolean;
}

const STORAGE_PREFIX = 'crmp_';

// Initialize default data if not present
const initializeDefaultData = () => {
  const defaults = {
    'users.json': [],
    'reports.json': [],
    'statistics.json': {
      totalUsers: 0,
      activeUsers: 0,
      totalPlayTime: 0,
      serverUptime: 0,
      lastUpdated: new Date().toISOString()
    }
  };

  // First, try to migrate any existing data
  const migrateExistingData = () => {
    Object.keys(defaults).forEach(key => {
      const oldKey = `crmp_${key.replace('.json', '')}`;
      const newKey = `${STORAGE_PREFIX}${key}`;
      const oldData = localStorage.getItem(oldKey);
      
      if (oldData) {
        localStorage.setItem(newKey, oldData);
        localStorage.removeItem(oldKey); // Remove old key after migration
      }
    });
  };

  migrateExistingData();

  // Then initialize any missing data
  Object.entries(defaults).forEach(([key, value]) => {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  });
};

// Initialize data on module load
initializeDefaultData();

export const storage = {
  read: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  },

  write: <T>(key: string, data: T, options: StorageOptions = {}): void => {
    try {
      const jsonData = options.pretty 
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }
};