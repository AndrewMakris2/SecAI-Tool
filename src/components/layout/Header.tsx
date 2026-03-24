import { Sun, Moon, Menu, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function Header() {
  const { setSidebarOpen, analytics, userProfile, settings, updateSettings } = useAppStore();
  const theme = settings.theme;

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Streak indicator */}
        {analytics.studyStreak > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-base">🔥</span>
            <span className="text-xs font-semibold text-amber-400">{analytics.studyStreak} day streak</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Overall accuracy pill */}
        {analytics.totalQuestionsAnswered > 0 && (
          <div className={cn(
            'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium',
            analytics.overallAccuracy >= 80
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : analytics.overallAccuracy >= 60
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400',
          )}>
            <Zap size={12} />
            {analytics.overallAccuracy}% accuracy
          </div>
        )}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold select-none">
          {userProfile?.name ? userProfile.name[0].toUpperCase() : 'S'}
        </div>
      </div>
    </header>
  );
}
