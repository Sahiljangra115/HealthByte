import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { MOCK_PROFILE } from '../constants';
import { Edit2, Scale, Target, Watch, Bell, Lock, LogOut, ChevronRight } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 pb-12"
    >
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background shadow-lg">
            <Edit2 className="w-3 h-3 text-black" />
          </button>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-extrabold tracking-tight">{MOCK_PROFILE.name}</h2>
          <p className="text-white/40 text-sm font-medium">{MOCK_PROFILE.email}</p>
          <div className="pt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
              Goal: Lean Muscle Gain
            </span>
          </div>
        </div>
        
        <button className="soul-gradient text-black font-bold px-8 py-3 rounded-2xl w-full max-w-xs shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          Edit Profile
        </button>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1">
          <span className="text-2xl font-headline font-bold">1,248</span>
          <span className="text-[8px] font-bold text-white/40 tracking-widest uppercase">Meals Logged</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1 border-primary/30">
          <span className="text-2xl font-headline font-bold text-primary">14</span>
          <span className="text-[8px] font-bold text-primary/70 tracking-widest uppercase">Day Streak</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center space-y-1">
          <span className="text-2xl font-headline font-bold">62</span>
          <span className="text-[8px] font-bold text-white/40 tracking-widest uppercase">Days Active</span>
        </GlassCard>
      </section>

      {/* Body Composition */}
      <GlassCard className="p-6">
        <h3 className="text-xs font-bold text-white/40 mb-4 flex items-center gap-2 tracking-widest uppercase">
          <Scale className="w-4 h-4" />
          Body Composition
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Height</span>
            <span className="text-lg font-headline font-bold">{MOCK_PROFILE.height} cm</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Weight</span>
            <span className="text-lg font-headline font-bold">{MOCK_PROFILE.weight} kg</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">BMI</span>
              <p className="text-lg font-headline font-bold">23.7</p>
            </div>
            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">NORMAL</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Body Fat</span>
            <span className="text-lg font-headline font-bold">14.2 %</span>
          </div>
        </div>
      </GlassCard>

      {/* Settings Groups */}
      <div className="space-y-4">
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-sm">Health Goals</span>
          </div>
          <div className="px-4">
            <button className="w-full py-4 flex items-center justify-between group">
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">Calorie Target</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">2,400 kcal</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </div>
            </button>
            <button className="w-full py-4 flex items-center justify-between border-t border-white/5 group">
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">Macro Goals</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">40/30/30</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </div>
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Watch className="w-4 h-4 text-secondary" />
            </div>
            <span className="font-bold text-sm">Connected Devices</span>
          </div>
          <div className="px-4">
            <button className="w-full py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Apple Watch</span>
                <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-widest uppercase">Connected</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-tertiary" />
            </div>
            <span className="font-bold text-sm">Notifications</span>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-white/60">Meal Reminders</span>
              <div className="w-10 h-5 bg-primary rounded-full relative flex items-center px-1">
                <div className="w-3 h-3 bg-black rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <button className="w-full glass rounded-3xl p-4 flex items-center justify-center gap-2 text-red-400 font-bold active:scale-95 transition-transform">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col items-center justify-center pt-4 opacity-20">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase">NutriLens AI v2.4.0</p>
      </div>
    </motion.div>
  );
};
