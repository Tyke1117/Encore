import { EventItem, UserProfileData } from '../types/events';

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt_101',
    title: 'Cultural Night',
    club: 'Cultural Committee',
    category: 'Culture',
    date: '2026-07-22',
    time: '6:00 PM',
    location: 'Open Air Theatre',
    description: 'An evening of music, dance, and performances celebrating campus talent. Open to all students.',
    seatsLeft: 40,
    totalSeats: 300,
    status: 'filling_fast',
  },
  {
    id: 'evt_102',
    title: 'AI/ML Workshop',
    club: 'IEEE Student Chapter',
    category: 'Technology',
    date: '2026-07-25',
    time: '10:00 AM',
    location: 'Seminar Hall B',
    description: 'Hands-on workshop covering machine learning basics, with a project walkthrough at the end.',
    seatsLeft: 104,
    totalSeats: 150,
    status: 'open',
  },
  {
    id: 'evt_103',
    title: 'Sports Meet',
    club: 'Sports Committee',
    category: 'Sports',
    date: '2026-08-02',
    time: '8:00 AM',
    location: 'Ground',
    description: 'Annual inter-branch sports meet featuring track, field, and team events.',
    seatsLeft: 0,
    totalSeats: 500,
    status: 'closed',
  },
];

const MOCK_PROFILE: UserProfileData = {
  id: 'user_001',
  name: 'Aashwi Patel',
  initials: 'AP',
  branch: 'Information Technology',
  year: '3rd Year',
  eventsAttended: 12,
  clubsFollowed: ['IEEE Student Chapter', 'Cultural Committee', 'Coding Club'],
  pastEvents: [
    { id: 'evt_050', title: 'Tech Fest 2025', date: '2025-08-10' },
    { id: 'evt_051', title: 'Freshers Welcome', date: '2025-09-02' },
  ],
};

export async function getEvents(): Promise<EventItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_EVENTS;
}

export async function getEventById(id: string): Promise<EventItem | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_EVENTS.find((e) => e.id === id);
}

export async function getUserProfile(): Promise<UserProfileData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_PROFILE;
}
