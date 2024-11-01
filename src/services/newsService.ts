import { NewsItem } from '../types';
import { fileStorage } from './fileStorage';
import { generateId } from '../utils/helpers';

const NEWS_FILE = 'news.json';

export const newsService = {
  getAll: (): NewsItem[] => {
    return fileStorage.read<NewsItem[]>(NEWS_FILE, []);
  },

  getById: (id: string): NewsItem | undefined => {
    const news = fileStorage.read<NewsItem[]>(NEWS_FILE, []);
    return news.find(item => item.id === id);
  },

  create: (newsData: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>): NewsItem => {
    const news = fileStorage.read<NewsItem[]>(NEWS_FILE, []);
    
    const newItem: NewsItem = {
      ...newsData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    news.push(newItem);
    fileStorage.write(NEWS_FILE, news);

    return newItem;
  },

  update: (id: string, newsData: Partial<NewsItem>): NewsItem => {
    const news = fileStorage.read<NewsItem[]>(NEWS_FILE, []);
    const index = news.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('News item not found');
    }

    const updatedItem = {
      ...news[index],
      ...newsData,
      id,
      updatedAt: new Date().toISOString()
    };

    news[index] = updatedItem;
    fileStorage.write(NEWS_FILE, news);

    return updatedItem;
  },

  delete: (id: string): void => {
    const news = fileStorage.read<NewsItem[]>(NEWS_FILE, []);
    const filteredNews = news.filter(item => item.id !== id);
    fileStorage.write(NEWS_FILE, filteredNews);
  },

  togglePin: (id: string): NewsItem => {
    const news = fileStorage.read<NewsItem[]>(NEWS_FILE, []);
    const index = news.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error('News item not found');
    }

    news[index].pinned = !news[index].pinned;
    fileStorage.write(NEWS_FILE, news);

    return news[index];
  }
};