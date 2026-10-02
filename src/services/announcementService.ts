import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDynamicNotification } from './notificationService';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'event_added' | 'event_modified' | 'ticket_price' | 'discount' | 'admin_broadcast';
  eventId?: string;
  eventName?: string;
  ticketPrice?: string | number;
  originalPrice?: string | number;
  discountPercentage?: number;
  eventDate?: string;
  venue?: string;
  createdAt: string;
  authorName: string;
  authorRole: 'admin';
  important?: boolean;
}

const ANNOUNCEMENTS_STORAGE_KEY = '@encore_announcements_v1';

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🔥 Early Bird Ticket Discount: Encore Hackathon 2026',
    content: 'Get 25% OFF on premium registration passes for Encore Hackathon 2026! Limited slots remaining for tech enthusiasts.',
    type: 'discount',
    eventId: '1',
    eventName: 'Encore Hackathon 2026',
    ticketPrice: 'Free',
    originalPrice: '₹200',
    discountPercentage: 100,
    eventDate: '18 Jul 2026',
    venue: 'CL-1 Auditorium',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    authorName: 'Admin Team',
    authorRole: 'admin',
    important: true,
  },
  {
    id: 'ann-2',
    title: '📢 New Event Published: Cultural Night Gala',
    content: 'An exciting Cultural Night Gala has been officially scheduled. Check out performance details and grab your tickets early!',
    type: 'event_added',
    eventId: '2',
    eventName: 'Cultural Night Gala',
    ticketPrice: '₹200',
    eventDate: '22 Jul 2026',
    venue: 'Open Air Theatre',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hrs ago
    authorName: 'Encore Admin',
    authorRole: 'admin',
    important: false,
  },
  {
    id: 'ann-3',
    title: '🕒 Schedule & Venue Update: AI/ML Hands-on Workshop',
    content: 'Please note: AI/ML Workshop date and timing have been updated. Ticket prices remain unchanged at ₹500 with hands-on GPU access provided.',
    type: 'event_modified',
    eventId: '3',
    eventName: 'AI/ML Hands-on Workshop',
    ticketPrice: '₹500',
    eventDate: '25 Jul 2026',
    venue: 'Seminar Hall B',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hrs ago
    authorName: 'Admin Desk',
    authorRole: 'admin',
    important: true,
  },
  {
    id: 'ann-4',
    title: '🎟️ Special Student Pass Offer: College Sports Meet',
    content: 'Entry is 100% FREE for all verified students! Track, football and basketball matches open to all attendees.',
    type: 'ticket_price',
    eventId: '4',
    eventName: 'College Sports Meet',
    ticketPrice: 'Free',
    eventDate: '02 Aug 2026',
    venue: 'Main Ground',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    authorName: 'Admin Team',
    authorRole: 'admin',
    important: false,
  },
];

/**
 * Fetch all announcements stored or initial defaults.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const data = await AsyncStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Store initial mock announcements if empty
    await AsyncStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  } catch (err) {
    console.warn('Failed to read announcements from storage:', err);
    return INITIAL_ANNOUNCEMENTS;
  }
}

/**
 * Add a new announcement (ONLY accessible by Admin).
 * Automatically triggers a dynamic user notification!
 */
export async function addAnnouncement(
  newAnnData: Omit<Announcement, 'id' | 'createdAt' | 'authorRole'>
): Promise<Announcement> {
  const currentList = await getAnnouncements();
  
  const announcement: Announcement = {
    ...newAnnData,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString(),
    authorRole: 'admin',
  };

  const updatedList = [announcement, ...currentList];
  await AsyncStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updatedList));

  // Trigger dynamic notification for users!
  let notifType: 'update' | 'alert' | 'reminder' = 'update';
  if (announcement.important) notifType = 'alert';
  if (announcement.type === 'discount') notifType = 'update';

  await addDynamicNotification({
    title: announcement.title,
    body: announcement.content,
    type: notifType,
  });

  return announcement;
}

/**
 * System helper called whenever an event is created, modified, or ticket prices/discounts change in Encore.
 */
export async function notifyEventChangeAnnouncement(
  eventType: 'event_added' | 'event_modified' | 'ticket_price' | 'discount',
  eventDetails: {
    id?: string;
    name: string;
    ticketPrice?: string | number;
    originalPrice?: string | number;
    discountPercentage?: number;
    eventDate?: string;
    venue?: string;
    description?: string;
  }
): Promise<Announcement> {
  let title = '';
  let content = '';

  switch (eventType) {
    case 'event_added':
      title = `🎉 New Event Added: ${eventDetails.name}`;
      content = `A new event "${eventDetails.name}" has been added to Encore! Ticket Price: ${eventDetails.ticketPrice || 'Free'}, Date: ${eventDetails.eventDate || 'TBA'}, Venue: ${eventDetails.venue || 'TBA'}.`;
      break;
    case 'event_modified':
      title = `📢 Event Updated: ${eventDetails.name}`;
      content = `The event "${eventDetails.name}" details have been modified. Date: ${eventDetails.eventDate || 'TBA'}, Venue: ${eventDetails.venue || 'TBA'}, Ticket: ${eventDetails.ticketPrice || 'N/A'}.`;
      break;
    case 'ticket_price':
      title = `🎟️ Ticket Update: ${eventDetails.name}`;
      content = `Ticket prices for "${eventDetails.name}" have been updated to ${eventDetails.ticketPrice}.`;
      break;
    case 'discount':
      title = `🏷️ Special Discount Alert: ${eventDetails.name}`;
      content = `Exciting news! Get ${eventDetails.discountPercentage || 20}% OFF on tickets for ${eventDetails.name}! Current price: ${eventDetails.ticketPrice}.`;
      break;
  }

  return await addAnnouncement({
    title,
    content,
    type: eventType,
    eventId: eventDetails.id,
    eventName: eventDetails.name,
    ticketPrice: eventDetails.ticketPrice,
    originalPrice: eventDetails.originalPrice,
    discountPercentage: eventDetails.discountPercentage,
    eventDate: eventDetails.eventDate,
    venue: eventDetails.venue,
    authorName: 'Encore Admin',
    important: true,
  });
}
