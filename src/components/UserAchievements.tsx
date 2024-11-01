import React from 'react';
import { X, Trophy, Star, Clock, Target } from 'lucide-react';

interface UserAchievementsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACHIEVEMENTS = [
  {
    id: 'first_login',
    title: 'Welcome Aboard',
    description: 'Log in for the first time',
    icon: Star,
    points: 10,
    unlocked: true,
    progress: 100
  },
  {
    id: 'playtime_10',
    title: 'Dedicated Player',
    description: 'Play for 10 hours',
    icon: Clock,
    points: 20,
    unlocked: false,
    progress: 65
  },
  {
    id: 'level_10',
    title: 'Rising Star',
    description: 'Reach level 10',
    icon: Target,
    points: 30,
    unlocked: false,
    progress: 40
  }
];

const UserAchievements: React.FC<UserAchievementsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-900 w-full max-w-md h-full shadow-xl p-6 animate-slide-left">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="text-purple-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Achievements</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {ACHIEVEMENTS.map(achievement => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  achievement.unlocked ? 'bg-purple-500/20' : 'bg-gray-700'
                }`}>
                  <Icon size={24} className={achievement.unlocked ? 'text-purple-400' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white">{achievement.title}</h3>
                    <span className={`text-sm ${
                      achievement.unlocked ? 'text-purple-400' : 'text-gray-400'
                    }`}>
                      {achievement.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                      <div
                        style={{ width: `${achievement.progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          achievement.unlocked ? 'bg-purple-500' : 'bg-purple-500/50'
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {achievement.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAchievements;