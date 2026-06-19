import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, glow }) => {
  return (
    <div className={cn(
      "glass rounded-3xl p-6 transition-all duration-300",
      glow && "shadow-[0_0_20px_rgba(48,209,88,0.15)] border-primary/30",
      className
    )}>
      {children}
    </div>
  );
};
