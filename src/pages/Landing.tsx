import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Layers,
  Zap,
  BarChart3,
  BookOpen,
  Library,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const featurePills = ['AI Tutor', 'Smart Flashcards', 'Domain Analytics', 'Exam Mode'];

const stats = [
  { value: '200', label: 'Questions' },
  { value: '100', label: 'Flashcards' },
  { value: '7', label: 'Domains' },
  { value: 'AI', label: 'Powered' },
];

const features = [
  {
    icon: MessageSquare,
    title: 'AI Tutor',
    description: 'Your personal SecAI+ coach powered by GPT-4 or Claude',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Layers,
    title: 'Smart Flashcards',
    description: 'Spaced repetition style learning across all certification domains',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Zap,
    title: 'Exam Pressure Mode',
    description: 'Timed, hard-mode quizzes that simulate real exam conditions',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: BarChart3,
    title: 'Domain Analytics',
    description: 'Track your readiness across all 7 SecAI+ domains',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: BookOpen,
    title: 'Question Bank',
    description: '200 scenario-based questions with detailed explanations',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Library,
    title: 'Study Guides',
    description: 'Article-style deep dives into every certification topic',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
];

const whyPoints = [
  'The first vendor-neutral certification focused entirely on AI security and governance',
  'Validates skills to secure AI/ML pipelines, detect adversarial attacks, and govern AI responsibly',
  'Recognized by employers building AI-aware security teams in 2025 and beyond',
  'Covers the full lifecycle: data integrity, model hardening, incident response, and compliance',
];

export function Landing() {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">
              SecAI<span className="text-cyan-400">+</span>
            </span>
          </div>

          {/* CTA */}
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200"
          >
            Start Studying
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 flex flex-col items-center text-center overflow-hidden">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Gradient orbs */}
        <div className="pointer-events-none absolute top-10 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 -right-32 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-xs text-cyan-400 font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            200+ Practice Questions
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6"
          >
            Master the{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CompTIA SecAI+
            </span>{' '}
            Certification
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered study platform with 200 practice questions, smart flashcards, and an AI tutor
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-xl shadow-cyan-500/25 transition-all duration-200 text-sm"
            >
              Start Studying Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center gap-2 border border-white/15 text-slate-300 hover:text-white hover:border-white/30 font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm bg-white/5 hover:bg-white/10">
              View Demo
            </button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {featurePills.map((pill, i) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.08 }}
                className="px-3 py-1 rounded-full bg-navy-800 border border-white/10 text-xs text-slate-300 font-medium"
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="bg-navy-900 flex flex-col items-center justify-center py-8 px-4"
            >
              <span className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              pass
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Six powerful study tools, all in one platform — designed for the way security
            professionals actually learn.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={`group relative rounded-2xl border ${feature.border} bg-navy-900/60 backdrop-blur-sm p-6 hover:bg-navy-800/80 transition-all duration-300`}
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${feature.bg} mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)',
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Why SecAI+? ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl border border-white/8 bg-navy-900/50 backdrop-blur-sm p-8 sm:p-12 overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px]" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Why{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  SecAI+?
                </span>
              </h2>
              <p className="text-slate-400">
                The certification that proves you can secure AI — not just use it.
              </p>
            </motion.div>

            <div className="space-y-4">
              {whyPoints.map((point, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-navy-800 to-violet-500/15 border border-white/8 rounded-3xl" />
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative text-center px-8 py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30 mb-6 mx-auto">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to pass the{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SecAI+?
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8 text-lg">
              Join security professionals preparing for the next generation of AI security certifications.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/30 transition-all duration-200 text-base"
            >
              Start Studying Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-slate-500">
              SecAI+ Study Platform{' '}
              <span className="text-slate-600">•</span>{' '}
              Built for Security Professionals
            </span>
          </div>
          <span className="text-xs text-slate-600">
            Not affiliated with CompTIA. Study tool only.
          </span>
        </div>
      </footer>
    </div>
  );
}
