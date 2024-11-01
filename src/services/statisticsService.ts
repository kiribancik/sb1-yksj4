import { Statistics } from '../types';
import { fileStorage } from './fileStorage';

const STATS_FILE = 'statistics.json';

export const statisticsService = {
  get: (): Statistics => {
    return fileStorage.read<Statistics>(STATS_FILE, {
      totalUsers: 0,
      activeUsers: 0,
      totalPlayTime: 0,
      serverUptime: 0,
      lastUpdated: new Date().toISOString()
    });
  },

  update: (stats: Partial<Statistics>): Statistics => {
    const currentStats = statisticsService.get();
    const updatedStats = {
      ...currentStats,
      ...stats,
      lastUpdated: new Date().toISOString()
    };

    fileStorage.write(STATS_FILE, updatedStats);
    return updatedStats;
  },

  incrementPlayTime: (minutes: number): void => {
    const stats = statisticsService.get();
    stats.totalPlayTime += minutes;
    fileStorage.write(STATS_FILE, stats);
  },

  updateActiveUsers: (count: number): void => {
    const stats = statisticsService.get();
    stats.activeUsers = count;
    fileStorage.write(STATS_FILE, stats);
  }
};