
import { cn } from '@/utils/cn';

export function Skeleton({ className, variant = 'rect' }: { className?: string; variant?: 'text' | 'rect' | 'circle' }) {
  return (
    <div className={cn(
      'animate-pulse bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800',
      variant === 'circle' && 'rounded-full',
      variant === 'text' && 'rounded h-4',
      variant === 'rect' && 'rounded-xl',
      className,
    )} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-navy-800/60 border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" variant="text" />
          <Skeleton className="h-3 w-1/3" variant="text" />
        </div>
      </div>
      <Skeleton className="h-24" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
