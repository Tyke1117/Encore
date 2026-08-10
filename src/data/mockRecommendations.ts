import { RecommendedEvent } from '../types/ai';

// This function shape is the important part, not the data inside it.
// When a real backend/recommendation endpoint exists, replace the body
// of getRecommendedEvents with a fetch call — the screens never need to change.

const MOCK_EVENTS: RecommendedEvent[] = [
  {
    id: 'evt_001',
    title: 'Tech Fest 2026',
    club: 'IEEE Student Chapter',
    category: 'Technology',
    date: '2026-08-14',
    location: 'DEPSTAR Auditorium',
    matchScore: 92,
    reasons: [
      { type: 'past_attendance', label: 'Because you attended Tech Fest 2025' },
      { type: 'same_club', label: 'Hosted by IEEE Student Chapter, a club you follow' },
    ],
  },
  {
    id: 'evt_002',
    title: 'Design Sprint Workshop',
    club: 'UI/UX Club',
    category: 'Design',
    date: '2026-08-20',
    location: 'CHARUSAT Innovation Lab',
    matchScore: 78,
    reasons: [
      { type: 'same_category', label: 'Similar to events you\u2019ve shown interest in' },
    ],
  },
  {
    id: 'evt_003',
    title: 'Inter-College Hackathon',
    club: 'Coding Club',
    category: 'Technology',
    date: '2026-09-02',
    location: 'Main Campus Ground',
    matchScore: 85,
    reasons: [
      { type: 'trending', label: 'Trending among students in your year' },
      { type: 'same_category', label: 'Matches your interest in Technology events' },
    ],
  },
];

export async function getRecommendedEvents(userId?: string): Promise<RecommendedEvent[]> {
  // Simulated network delay so the UI's loading state is real and testable.
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_EVENTS;
}

export async function getRecommendedEventById(id: string): Promise<RecommendedEvent | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_EVENTS.find((e) => e.id === id);
}
