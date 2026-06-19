import React from 'react';
import { motion } from 'motion/react';

interface KineticRingsProps {
  calories: number;
  target: number;
  protein: number;
  proteinTarget: number;
  hydration: number;
  hydrationTarget: number;
}

export const KineticRings: React.FC<KineticRingsProps> = ({
  calories,
  target,
  protein,
  proteinTarget,
  hydration,
  hydrationTarget
}) => {
  const calPercent = Math.min((calories / target) * 100, 100);
  const protPercent = Math.min((protein / proteinTarget) * 100, 100);
  const waterPercent = Math.min((hydration / hydrationTarget) * 100, 100);

  const calculateOffset = (percent: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (percent / 100) * circumference;
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Tracks */}
        <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        <circle cx="50" cy="50" r="35" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        <circle cx="50" cy="50" r="25" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        
        {/* Progress Rings */}
        <motion.circle
          cx="50" cy="50" r="45" fill="transparent" stroke="#30D158" strokeWidth="8"
          strokeDasharray={2 * Math.PI * 45}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{ strokeDashoffset: calculateOffset(calPercent, 45) }}
          strokeLinecap="round"
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.circle
          cx="50" cy="50" r="35" fill="transparent" stroke="#0A84FF" strokeWidth="8"
          strokeDasharray={2 * Math.PI * 35}
          initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
          animate={{ strokeDashoffset: calculateOffset(protPercent, 35) }}
          strokeLinecap="round"
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="50" cy="50" r="25" fill="transparent" stroke="#BF5AF2" strokeWidth="8"
          strokeDasharray={2 * Math.PI * 25}
          initial={{ strokeDashoffset: 2 * Math.PI * 25 }}
          animate={{ strokeDashoffset: calculateOffset(waterPercent, 25) }}
          strokeLinecap="round"
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-headline font-extrabold text-5xl tracking-tighter text-white"
        >
          {calories.toLocaleString()}
        </motion.span>
        <span className="text-white/50 text-sm font-medium">of {target.toLocaleString()} kcal</span>
      </div>
    </div>
  );
};
