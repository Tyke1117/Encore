export interface EventItem {
  id: string;
  title: string;
  club: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  seatsLeft: number;
  totalSeats: number;
  status: 'open' | 'filling_fast' | 'closed';
}

export interface UserProfileData {
  id: string;
  name: string;
  initials: string;
  branch: string;
  year: string;
  eventsAttended: number;
  clubsFollowed: string[];
  pastEvents: { id: string; title: string; date: string }[];
}
