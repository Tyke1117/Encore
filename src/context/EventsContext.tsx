import React, { createContext, useContext, useState } from 'react';

export interface EventItem {
  id: string;
  name: string;
  category: 'tech' | 'cultural' | 'music' | 'sports' | 'general';
  date: string;
  time: string;
  venue: string;
  price: string;
  seatsLeft: number;
  totalSeats: number;
  imageIcon: string;
  status: 'Published' | 'Draft' | 'Completed';
  description?: string;
  organizerName?: string;
}

interface EventsContextType {
  events: EventItem[];
  addEvent: (newEvent: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, updatedData: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
}

const initialEvents: EventItem[] = [
  {
    id: '1',
    name: 'Encore Hackathon 2026',
    category: 'tech',
    date: '18 Jul 2026',
    time: '09:00 AM',
    venue: 'CL-1 Auditorium',
    price: 'Free',
    seatsLeft: 86,
    totalSeats: 300,
    imageIcon: 'code-slash',
    status: 'Published',
    description: 'Annual 24-hour coding challenge for developers and UI designers. Build real-world solutions and win prizes.',
    organizerName: 'Tech Club',
  },
  {
    id: '2',
    name: 'Cultural Night Gala',
    category: 'cultural',
    date: '22 Jul 2026',
    time: '06:00 PM',
    venue: 'Open Air Theatre',
    price: '₹200',
    seatsLeft: 40,
    totalSeats: 250,
    imageIcon: 'musical-notes',
    status: 'Published',
    description: 'An evening of dance, drama, and acoustic music performances celebrating regional culture.',
    organizerName: 'Cultural Committee',
  },
  {
    id: '3',
    name: 'AI/ML Hands-on Workshop',
    category: 'tech',
    date: '25 Jul 2026',
    time: '10:00 AM',
    venue: 'Seminar Hall B',
    price: '₹500',
    seatsLeft: 104,
    totalSeats: 150,
    imageIcon: 'analytics',
    status: 'Published',
    description: 'Learn neural networks, PyTorch, and generative AI models with hands-on labs.',
    organizerName: 'AI Society',
  },
  {
    id: '4',
    name: 'College Sports Meet',
    category: 'sports',
    date: '02 Aug 2026',
    time: '08:00 AM',
    venue: 'Main Ground',
    price: 'Free',
    seatsLeft: 15,
    totalSeats: 200,
    imageIcon: 'trophy',
    status: 'Published',
    description: 'Inter-departmental athletics tournament including track, football, and basketball matches.',
    organizerName: 'Sports Council',
  },
  {
    id: '5',
    name: 'Acoustic Jam Session',
    category: 'music',
    date: '10 Aug 2026',
    time: '05:30 PM',
    venue: 'Student Lounge',
    price: '₹100',
    seatsLeft: 30,
    totalSeats: 80,
    imageIcon: 'guitar',
    status: 'Published',
    description: 'Unplugged musical performances by student bands and solo artists.',
    organizerName: 'Music Club',
  },
  {
    id: '6',
    name: 'Annual Design Summit 2026',
    category: 'tech',
    date: '15 Aug 2026',
    time: '11:00 AM',
    venue: 'Design Studio 3',
    price: '₹350',
    seatsLeft: 60,
    totalSeats: 100,
    imageIcon: 'color-palette-outline',
    status: 'Draft',
    description: 'Keynotes on product design, UX design systems, and micro-interactions.',
    organizerName: 'Design Guild',
  },
  {
    id: '7',
    name: 'Inter-College Battle of Bands',
    category: 'music',
    date: '20 Aug 2026',
    time: '07:00 PM',
    venue: 'Main Auditorium',
    price: '₹250',
    seatsLeft: 0,
    totalSeats: 400,
    imageIcon: 'mic-outline',
    status: 'Completed',
    description: 'High-energy rock and pop music competition featuring 12 college bands.',
    organizerName: 'Music Club',
  },
];

import { notifyEventChangeAnnouncement } from '../services/announcementService';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const addEvent = (newEventData: Omit<EventItem, 'id'>) => {
    const newEvent: EventItem = {
      ...newEventData,
      id: Date.now().toString(),
    };
    setEvents((prev) => [newEvent, ...prev]);

    notifyEventChangeAnnouncement('event_added', {
      id: newEvent.id,
      name: newEvent.name,
      ticketPrice: newEvent.price,
      eventDate: newEvent.date,
      venue: newEvent.venue,
      description: newEvent.description,
    }).catch((e) => console.warn('Failed to publish event announcement:', e));
  };

  const updateEvent = (id: string, updatedData: Partial<EventItem>) => {
    setEvents((prev) => {
      const target = prev.find((e) => e.id === id);
      if (target) {
        notifyEventChangeAnnouncement('event_modified', {
          id,
          name: updatedData.name || target.name,
          ticketPrice: updatedData.price || target.price,
          eventDate: updatedData.date || target.date,
          venue: updatedData.venue || target.venue,
          description: updatedData.description || target.description,
        }).catch((e) => console.warn('Failed to publish update announcement:', e));
      }
      return prev.map((event) => (event.id === id ? { ...event, ...updatedData } : event));
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
