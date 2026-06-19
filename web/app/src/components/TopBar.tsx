import React from 'react';
import { Bell } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-headline font-extrabold tracking-tighter text-primary">NutriLens</span>
      </div>
      <button className="relative p-2 text-white/60 hover:text-white transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
      </button>
    </header>
  );
};
