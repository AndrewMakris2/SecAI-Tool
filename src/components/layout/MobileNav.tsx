
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, Layers, MessageSquare, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/flashcards', label: 'Cards', icon: Layers },
  { to: '/ai-tutor', label: 'AI Tutor', icon: MessageSquare },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
] as const;

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 py-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => cn(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
            isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300',
          )}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
