import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Plus, Sparkles, Search } from 'lucide-react';

export const PlanScreen: React.FC = () => {
  const days = [
    { label: 'Mon', date: 12 },
    { label: 'Tue', date: 13, active: true },
    { label: 'Wed', date: 14 },
    { label: 'Thu', date: 15 },
    { label: 'Fri', date: 16 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight">Meal Plan</h1>
          <p className="text-white/50 text-sm font-medium">Curated for your metabolic profile</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl transition-all active:scale-95">
          <Sparkles className="w-4 h-4 text-primary fill-current" />
          <span className="text-sm font-bold tracking-wide">AI Plan</span>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {days.map((day, i) => (
          <button 
            key={i}
            className={`flex flex-col items-center justify-center min-w-[64px] h-[84px] rounded-3xl transition-all active:scale-90 ${
              day.active 
                ? 'soul-gradient shadow-lg shadow-primary/20' 
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${day.active ? 'text-black' : 'text-white/40'}`}>
              {day.label}
            </span>
            <span className={`text-lg font-bold ${day.active ? 'text-black' : 'text-white'}`}>
              {day.date}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-10 relative">
        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-white/5"></div>

        <section className="relative pl-10">
          <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
          <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">Breakfast <span className="ml-2 font-medium text-white/20">8:00 AM</span></h2>
          <GlassCard className="p-6 flex flex-col items-center justify-center border-dashed border-white/20">
            <p className="text-white/60 font-medium mb-4">What's for breakfast?</p>
            <div className="flex gap-3">
              <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <Plus className="w-5 h-5 text-primary" />
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <Search className="w-4 h-4 text-white/60" />
                <span className="text-xs font-bold text-white/80">Search</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/10">
                <Sparkles className="w-4 h-4 text-primary fill-current" />
                <span className="text-xs font-bold text-primary">AI Suggest</span>
              </button>
            </div>
          </GlassCard>
        </section>

        <section className="relative pl-10">
          <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-background border-2 border-secondary/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
          </div>
          <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">Lunch <span className="ml-2 font-medium text-white/20">1:00 PM</span></h2>
          <div className="bg-surface p-5 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-xl font-bold mb-1">Dal Rice + Garden Salad</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary font-bold text-lg">520 <span className="text-[10px] uppercase tracking-tighter text-primary/60">kcal</span></span>
              <div className="w-px h-3 bg-white/10"></div>
              <span className="text-white/40 text-xs">High Fiber • Probiotic</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-white/40 block leading-none mb-1">PROTEIN</span>
                <span className="text-xs font-bold">24g</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-white/40 block leading-none mb-1">CARBS</span>
                <span className="text-xs font-bold">68g</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-white/40 block leading-none mb-1">FATS</span>
                <span className="text-xs font-bold">12g</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
