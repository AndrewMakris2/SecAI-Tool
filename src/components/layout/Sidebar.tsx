
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Brain, Layers, FlaskConical,
  BarChart3, Settings, Zap, MessageSquare, Library, X, ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quiz', label: 'Practice Quiz', icon: Brain },
  { to: '/questions', label: 'Question Bank', icon: BookOpen },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/study-guides', label: 'Study Guides', icon: Library },
  { to: '/facts', label: 'Facts & Terms', icon: FlaskConical },
  { to: '/ai-tutor', label: 'AI Tutor', icon: MessageSquare, highlight: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-navy-900/95 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 flex-shrink-0">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">SecAI+</span>
              <span className="block text-[10px] text-cyan-400/70 leading-none tracking-wider">STUDY PLATFORM</span>
            </div>
          </NavLink>
          <button className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, highlight }: any) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/20'
                  : [
                      'text-slate-400 hover:text-white hover:bg-white/5',
                      highlight && !location.pathname.startsWith(to) ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/5' : '',
                    ].join(' '),
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {highlight && (
                <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full border border-violet-500/30">AI</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Exam pressure CTA */}
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <NavLink
            to="/quiz?mode=exam-pressure"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
          >
            <Zap size={16} className="text-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-400">Exam Pressure Mode</p>
              <p className="text-[10px] text-slate-500 truncate">Timed · Hard questions</p>
            </div>
            <ChevronRight size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
          </NavLink>
        </div>
      </aside>
    </>
  );
}
