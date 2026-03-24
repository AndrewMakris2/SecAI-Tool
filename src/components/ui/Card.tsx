import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, glow = false, onClick, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      className={cn(
        'bg-navy-800/60 backdrop-blur-sm border border-white/5 rounded-2xl',
        paddings[padding],
        hover && 'transition-all duration-300 hover:bg-navy-700/60 hover:border-cyan-500/20 cursor-pointer',
        glow && 'shadow-lg shadow-cyan-500/5',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon, className }: { title: string; subtitle?: string; action?: React.ReactNode; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">{icon}</div>}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
