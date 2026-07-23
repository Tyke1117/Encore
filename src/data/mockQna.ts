import { QuickQuestion } from '../types/ai';

// Phase 1: rule-based FAQ lookup, not a trained language model.
// getAnswer() is the swap point if a real AI backend is added later —
// screens only ever call this function, never read QUICK_QUESTIONS directly for matching.

export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'q_score',
    question: 'How is my match score calculated?',
    answer:
      'Your match score is based on your club memberships, categories you\u2019ve engaged with, and events you\u2019ve attended before. Higher overlap means a higher score.',
  },
  {
    id: 'q_improve',
    question: 'How do I get better recommendations?',
    answer:
      'Follow more clubs, attend events, and mark ones you\u2019re interested in. The more activity recorded, the more accurate your recommendations become.',
  },
  {
    id: 'q_data',
    question: 'What data does this use?',
    answer:
      'Recommendations use your club follows, past event attendance, and event categories. No personal messages or location data are used.',
  },
  {
    id: 'q_wrong',
    question: 'A recommendation doesn\u2019t fit me. Why?',
    answer:
      'Recommendations improve as more of your activity is recorded. Early on, with limited history, matches can be broader than expected.',
  },
];

const FALLBACK_ANSWER =
  'I\u2019m still learning and can only answer a few common questions right now. Try one of the suggestions above.';

export async function getAnswer(question: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const normalized = question.trim().toLowerCase();
  const match = QUICK_QUESTIONS.find(
    (q) => q.question.toLowerCase() === normalized
  );

  return match ? match.answer : FALLBACK_ANSWER;
}
