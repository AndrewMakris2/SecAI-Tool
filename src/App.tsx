import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ToastProvider } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';

// Pages – lazy-load in a future pass; direct imports are fine for v1
import { Landing } from '@/pages/Landing';
import { Onboarding } from '@/pages/Onboarding';
import { Dashboard } from '@/pages/Dashboard';
import { Quiz } from '@/pages/Quiz';
import QuestionBank from '@/pages/QuestionBank';
import Flashcards from '@/pages/Flashcards';
import StudyGuides from '@/pages/StudyGuides';
import Facts from '@/pages/Facts';
import AITutor from '@/pages/AITutor';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

/** Guard: redirect to onboarding if the user hasn't completed it yet. */
function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAppStore();
  if (!userProfile?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  const { settings } = useAppStore();
  const theme = settings.theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* App routes (require completed onboarding) */}
          <Route
            element={
              <RequireOnboarding>
                <Layout />
              </RequireOnboarding>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/questions" element={<QuestionBank />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/study-guides" element={<StudyGuides />} />
            <Route path="/facts" element={<Facts />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
