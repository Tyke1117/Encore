// Types for the AI Recommendation module.
// If Pari's relationship-graph module already exports a base `Event` type
// by the time you integrate, extend that instead of duplicating fields here.

export interface RecommendedEvent {
  id: string;
  title: string;
  club: string;
  category: string;
  date: string; // ISO string, e.g. "2026-08-14"
  location: string;
  imageUrl?: string;

  // The "AI" part: why this was recommended, and a confidence-style score.
  // In Phase 1 this is rule-based (see mockRecommendations.ts), not a trained model.
  matchScore: number; // 0-100
  reasons: RecommendationReason[];
}

export interface RecommendationReason {
  type: 'same_club' | 'same_category' | 'past_attendance' | 'trending';
  label: string; // human-readable, e.g. "Because you attended Tech Fest 2025"
}

// Q&A module types.
// Phase 1 is a guided FAQ, not a real language model — see mockQna.ts.
export interface QnaMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface QuickQuestion {
  id: string;
  question: string;
  answer: string;
}
