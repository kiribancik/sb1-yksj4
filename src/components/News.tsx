import React from 'react';
import { newsService } from '../services/newsService';
import { Pin } from 'lucide-react';

const News = () => {
  const news = newsService.getAll();
  const pinnedNews = news.filter(item => item.pinned);
  const regularNews = news.filter(item => !item.pinned);
  const sortedNews = [...pinnedNews, ...regularNews];

  return (
    <div className="bg-black/95 py-16" id="news">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 animate-slide-right">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
          {sortedNews.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white/5 rounded-lg animate-fade-in">
              <p className="text-gray-400">No news available at the moment.</p>
            </div>
          ) : (
            sortedNews.map((item) => (
              <div 
                key={item.id} 
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors card-hover"
              >
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-purple-400">{new Date(item.createdAt).toLocaleDateString()}</div>
                    {item.pinned && (
                      <div className="flex items-center gap-1 text-yellow-400 animate-bounce-in">
                        <Pin size={14} />
                        <span className="text-xs">Pinned</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.content}</p>
                  <p className="text-sm text-gray-500">Posted by {item.authorName}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;