import React from 'react';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red';
  className?: string;
}

const colorMap = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'cyan', className }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn('bg-navy-800/60 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 hover:border-opacity-50', c.border, className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', c.text)}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className={cn('p-2.5 rounded-xl flex-shrink-0', c.bg)}><div className={c.text}>{icon}</div></div>}
      </div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-3 text-xs', trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400')}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{trend > 0 ? '+' : ''}{trend}% from last week</span>
        </div>
      )}
    </div>
  );
}
