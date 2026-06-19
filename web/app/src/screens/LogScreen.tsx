import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { MOCK_MEALS } from '../constants';
import { Plus, ChevronRight } from 'lucide-react';

export const LogScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col">
        <h2 className="text-3xl font-headline font-extrabold tracking-tight">Today</h2>
        <span className="text-white/40 text-sm font-medium">Tuesday, Oct 24</span>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5"></div>

        <div className="space-y-10">
          {/* Breakfast */}
          <div className="relative pl-12">
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(48,209,88,0.5)]"></div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline font-bold text-lg">Breakfast</h3>
                <span className="text-white/40 text-xs">8:14 AM</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-headline font-bold">{MOCK_MEALS[0].calories}</span>
                <span className="text-white/40 text-[10px] block uppercase">kcal</span>
              </div>
            </div>
            <GlassCard className="p-4 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={MOCK_MEALS[0].imageUrl} alt="Meal" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-2">{MOCK_MEALS[0].name}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">12G PRO</span>
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20">45G CARB</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20" />
            </GlassCard>
          </div>

          {/* Lunch */}
          <div className="relative pl-12">
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-white/10"></div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline font-bold text-lg">Lunch</h3>
                <span className="text-white/40 text-xs">1:15 PM</span>
              </div>
            </div>
            <button className="w-full border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors">
              <Plus className="w-6 h-6 text-white/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Add Lunch</span>
            </button>
          </div>

          {/* Dinner */}
          <div className="relative pl-12 opacity-40">
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-white/10"></div>
            <h3 className="font-headline font-bold text-lg">Dinner</h3>
            <span className="text-white/40 text-xs">Scheduled: 7:30 PM</span>
          </div>
        </div>
      </div>

      {/* Macro Summary Bar */}
      <div className="fixed bottom-28 left-6 right-6 z-40">
        <GlassCard className="p-5 bg-background/80 backdrop-blur-3xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase">Pro</span>
                <span className="text-sm font-bold">84g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-secondary uppercase">Carb</span>
                <span className="text-sm font-bold">142g</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-tertiary uppercase">Fat</span>
                <span className="text-sm font-bold">38g</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/40 text-[10px] font-bold uppercase block">Remaining</span>
              <span className="text-lg font-headline font-extrabold">600 kcal</span>
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full flex overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '40%' }}></div>
            <div className="h-full bg-secondary" style={{ width: '35%' }}></div>
            <div className="h-full bg-tertiary" style={{ width: '15%' }}></div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};
