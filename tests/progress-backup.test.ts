import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import type { QuizSession } from '../src/types';

// The store uses browser storage at import time. Give each test its own local state.
const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (name: string) => storage.get(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.delete(name),
  },
});
const { useAppStore } = await import('../src/store/useAppStore');
const initialState = useAppStore.getState();

const quiz: QuizSession = {
  id: 'practice-quiz',
  mode: 'random',
  timed: false,
  startedAt: '2026-11-01T10:00:00Z',
  completedAt: '2026-11-01T10:01:00Z',
  questionIds: ['q1'],
  answers: [
    {
      questionId: 'q1',
      selectedAnswer: 1,
      isCorrect: true,
      timeSpent: 20,
      confidence: 'very-sure',
      flagged: false,
    },
  ],
  score: 100,
};

beforeEach(() => {
  storage.clear();
  useAppStore.setState(initialState, true);
});

test('a backup restores study progress and keeps provider credentials out of the file', () => {
  const study = useAppStore.getState();
  const dummyKey = 'example-credential-for-backup-test';
  study.setAIConfig({ provider: 'openai', apiKey: dummyKey });
  study.addQuizSession(quiz);
  study.flagQuestion('q1');
  const backup = study.exportData();

  assert.equal(Object.hasOwn(JSON.parse(backup), 'settings'), false);
  assert.equal(backup.includes(dummyKey), false);
  assert.equal(useAppStore.getState().settings.aiConfig?.apiKey, dummyKey);

  study.resetProgress();
  assert.deepEqual(useAppStore.getState().quizSessions, []);
  study.importData(backup);
  const restored = useAppStore.getState();
  assert.deepEqual(restored.quizSessions, [quiz]);
  assert.deepEqual(restored.flaggedQuestions, ['q1']);
  assert.equal(restored.analytics.totalCorrect, 1);
});

test('an older backup restores quiz history and preserves this device’s settings', () => {
  const study = useAppStore.getState();
  study.setAIConfig({ provider: 'groq', apiKey: 'example-on-this-device' });
  const localSettings = useAppStore.getState().settings;
  const legacyBackup = {
    quizSessions: [quiz],
    settings: { theme: 'light', aiConfig: { provider: 'openai', apiKey: 'example-in-older-format' } },
    exportedAt: '2026-11-01T10:02:00Z',
  };

  study.importData(JSON.stringify(legacyBackup));
  assert.deepEqual(useAppStore.getState().quizSessions, [quiz]);
  assert.deepEqual(useAppStore.getState().settings, localSettings);
  assert.equal(study.exportData().includes('example-in-older-format'), false);
});
