
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'gradient';
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showValue = false, size = 'md', color = 'gradient', className }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    cyan: 'bg-cyan-500', blue: 'bg-blue-500', violet: 'bg-violet-500',
    green: 'bg-green-500', amber: 'bg-amber-500', red: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  };
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs font-medium text-slate-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-navy-900 rounded-full overflow-hidden', heights[size])}>
        <div className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[color])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
