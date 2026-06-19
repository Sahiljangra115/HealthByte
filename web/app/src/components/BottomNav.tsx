import React from 'react';
import { Home, Edit3, Camera, Calendar, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'log', icon: Edit3, label: 'Log' },
    { id: 'scan', icon: Camera, label: 'Scan', isCenter: true },
    { id: 'plan', icon: Calendar, label: 'Plan' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 h-24 bg-white/5 backdrop-blur-2xl rounded-t-[32px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center transition-all duration-300",
            tab.isCenter ? "relative -top-6" : "active:scale-90",
            activeTab === tab.id ? "text-primary" : "text-white/40"
          )}
        >
          {tab.isCenter ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 soul-gradient rounded-full flex items-center justify-center shadow-xl shadow-primary/20 active:scale-95 transition-transform">
                <tab.icon className="w-8 h-8 text-black" />
              </div>
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest mt-2">
                {tab.label}
              </span>
            </div>
          ) : (
            <>
              <tab.icon className={cn("w-6 h-6 mb-1", activeTab === tab.id && "fill-current")} />
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest">
                {tab.label}
              </span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};
