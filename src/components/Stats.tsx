import React from 'react';
import { Users, Server, Clock } from 'lucide-react';

const Stats = () => {
  return (
    <div className="bg-black/90 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors card-hover">
            <Users className="w-8 h-8 text-purple-500 mb-4 animate-bounce-in" />
            <h3 className="text-2xl font-bold text-white mb-2">15,000+</h3>
            <p className="text-gray-400 text-center">Active Players</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors card-hover">
            <Server className="w-8 h-8 text-purple-500 mb-4 animate-bounce-in" />
            <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
            <p className="text-gray-400 text-center">Unique Servers</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors card-hover">
            <Clock className="w-8 h-8 text-purple-500 mb-4 animate-bounce-in" />
            <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
            <p className="text-gray-400 text-center">Online Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;