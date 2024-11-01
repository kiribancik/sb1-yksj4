import { Report } from '../types';
import { fileStorage } from './fileStorage';
import { generateId } from '../utils/helpers';

const REPORTS_FILE = 'reports.json';

export const reportService = {
  getAll: (): Report[] => {
    return fileStorage.read<Report[]>(REPORTS_FILE, []);
  },

  getById: (id: string): Report | undefined => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    return reports.find(report => report.id === id);
  },

  getByUserId: (userId: string): Report[] => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    return reports.filter(report => report.userId === userId);
  },

  create: (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Report => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    
    const newReport: Report = {
      ...reportData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      isNew: true // Mark as new for admins
    };

    reports.push(newReport);
    fileStorage.write(REPORTS_FILE, reports);

    return newReport;
  },

  update: (id: string, reportData: Partial<Report>): Report => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    const index = reports.findIndex(report => report.id === id);

    if (index === -1) {
      throw new Error('Report not found');
    }

    const updatedReport = {
      ...reports[index],
      ...reportData,
      id,
      updatedAt: new Date().toISOString()
    };

    reports[index] = updatedReport;
    fileStorage.write(REPORTS_FILE, reports);

    return updatedReport;
  },

  delete: (id: string): void => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    const filteredReports = reports.filter(report => report.id !== id);
    fileStorage.write(REPORTS_FILE, filteredReports);
  },

  addComment: (reportId: string, userId: string, content: string) => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    const index = reports.findIndex(report => report.id === reportId);

    if (index === -1) {
      throw new Error('Report not found');
    }

    const comment = {
      id: generateId(),
      userId,
      content,
      createdAt: new Date().toISOString()
    };

    reports[index].comments.push(comment);
    reports[index].updatedAt = new Date().toISOString();
    reports[index].hasNewComments = true; // Mark that there are new comments for the user
    
    fileStorage.write(REPORTS_FILE, reports);
    return comment;
  },

  markReportAsRead: (reportId: string): void => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    const index = reports.findIndex(report => report.id === reportId);

    if (index !== -1) {
      reports[index].isNew = false;
      fileStorage.write(REPORTS_FILE, reports);
    }
  },

  markCommentsAsRead: (reportId: string): void => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    const index = reports.findIndex(report => report.id === reportId);

    if (index !== -1) {
      reports[index].hasNewComments = false;
      fileStorage.write(REPORTS_FILE, reports);
    }
  },

  getUnreadCount: (userId: string, isAdmin: boolean): number => {
    const reports = fileStorage.read<Report[]>(REPORTS_FILE, []);
    
    if (isAdmin) {
      return reports.filter(report => report.isNew).length;
    } else {
      return reports.filter(report => 
        report.userId === userId && report.hasNewComments
      ).length;
    }
  }
};