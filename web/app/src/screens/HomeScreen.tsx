import React from 'react';
import { motion } from 'motion/react';
import { KineticRings } from '../components/KineticRings';
import { GlassCard } from '../components/GlassCard';
import { MOCK_STATS, MOCK_MEALS } from '../constants';
import { Droplets, Footprints, Zap, Heart, Activity, Moon, Lightbulb } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Rings Section */}
      <section className="flex justify-center py-4">
        <KineticRings 
          calories={MOCK_STATS.consumed}
          target={MOCK_STATS.target}
          protein={84}
          proteinTarget={140}
          hydration={MOCK_STATS.water}
          hydrationTarget={MOCK_STATS.waterTarget}
        />
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 flex flex-col gap-1">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Kcal Left</span>
          <span className="text-2xl font-headline font-bold text-white">{MOCK_STATS.target - MOCK_STATS.consumed}</span>
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '67%' }}></div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Water</span>
            <Droplets className="w-3 h-3 text-secondary" />
          </div>
          <span className="text-2xl font-headline font-bold text-white">
            {MOCK_STATS.water}
            <span className="text-sm font-normal text-white/40">/{MOCK_STATS.waterTarget}L</span>
          </span>
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: '48%' }}></div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Steps</span>
            <Footprints className="w-3 h-3 text-primary" />
          </div>
          <span className="text-2xl font-headline font-bold text-white">{MOCK_STATS.steps.toLocaleString()}</span>
          <div className="mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary fill-current" />
            <span className="text-[10px] text-primary font-bold">82% of goal</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Kcal</span>
            <Activity className="w-3 h-3 text-tertiary" />
          </div>
          <span className="text-2xl font-headline font-bold text-white">{MOCK_STATS.activeKcal}</span>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-tertiary font-bold">Moderate activity</span>
          </div>
        </GlassCard>
      </section>

      {/* Wearable Strip */}
      <section className="space-y-4">
        <h3 className="text-white/60 font-bold text-[10px] uppercase tracking-widest px-1">Wearable Vitality</h3>
        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
          <div className="flex-none glass px-6 py-3 rounded-full flex items-center gap-3">
            <Heart className="w-4 h-4 text-red-500 animate-pulse fill-current" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">{MOCK_STATS.heartRate}bpm</span>
              <span className="text-white/40 text-[10px]">Heart Rate</span>
            </div>
          </div>
          <div className="flex-none glass px-6 py-3 rounded-full flex items-center gap-3">
            <Droplets className="w-4 h-4 text-blue-400 fill-current" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">{MOCK_STATS.spo2}%</span>
              <span className="text-white/40 text-[10px]">SpO2</span>
            </div>
          </div>
          <div className="flex-none glass px-6 py-3 rounded-full flex items-center gap-3">
            <Moon className="w-4 h-4 text-tertiary fill-current" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">{MOCK_STATS.sleep}</span>
              <span className="text-white/40 text-[10px]">Sleep</span>
            </div>
          </div>
        </div>
      </section>

      {/* Last Meal */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Last Meal</h3>
          <span className="text-primary text-xs font-bold">View Log</span>
        </div>
        <GlassCard className="p-4 flex gap-4 items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
            <img src={MOCK_MEALS[1].imageUrl} alt="Meal" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between h-20 py-1">
            <div>
              <h4 className="text-white font-bold text-base leading-tight">{MOCK_MEALS[1].name}</h4>
              <span className="text-white/40 text-[10px]">{MOCK_MEALS[1].time}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs">{MOCK_MEALS[1].calories}</span>
                <span className="text-white/40 text-[9px] uppercase">kcal</span>
              </div>
              <div className="flex flex-col">
                <span className="text-secondary font-bold text-xs">{MOCK_MEALS[1].protein}g</span>
                <span className="text-white/40 text-[9px] uppercase">prot</span>
              </div>
              <div className="flex flex-col">
                <span className="text-tertiary font-bold text-xs">{MOCK_MEALS[1].fat}g</span>
                <span className="text-white/40 text-[9px] uppercase">fats</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* AI Insight */}
      <section className="relative">
        <div className="absolute -inset-0.5 bg-primary/30 blur-lg rounded-3xl"></div>
        <GlassCard className="relative p-6 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-primary fill-current" />
            </div>
            <div className="space-y-1">
              <h4 className="text-primary font-bold text-sm tracking-wide">Nutrition Insight</h4>
              <p className="text-white font-medium text-base leading-snug">
                Try <span className="text-primary">Dal Tadka + Brown Rice</span> for dinner to hit your daily protein goal.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>
    </motion.div>
  );
};
