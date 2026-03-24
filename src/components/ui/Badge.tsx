import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-slate-300',
  cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  green: 'bg-green-500/15 text-green-400 border border-green-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  red: 'bg-red-500/15 text-red-400 border border-red-500/30',
  outline: 'border border-white/20 text-slate-300',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', variants[variant], size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1', className)}>
      {children}
    </span>
  );
}

const domainColorMap: Record<string, BadgeVariant> = {
  'AI Security Fundamentals': 'blue',
  'Securing AI Systems': 'cyan',
  'Adversarial Threats': 'red',
  'AI Governance & Compliance': 'violet',
  'AI in Security Operations': 'amber',
  'Data Security & Model Integrity': 'green',
  'Incident Response for AI Systems': 'amber',
};

export function DomainBadge({ domain }: { domain: string }) {
  return <Badge variant={domainColorMap[domain] ?? 'default'}>{domain}</Badge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    easy: { variant: 'green', label: 'Easy' },
    medium: { variant: 'amber', label: 'Medium' },
    hard: { variant: 'red', label: 'Hard' },
  };
  const cfg = map[difficulty] ?? { variant: 'default', label: difficulty };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
