import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DynamicNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'reminder' | 'update' | 'alert' | 'certificate' | 'discount';
  read: boolean;
  certificateId?: string;
  eventId?: string;
  createdAt: string;
}

const NOTIFICATIONS_STORAGE_KEY = '@encore_notifications_v2';

const DEFAULT_DYNAMIC_NOTIFICATIONS: DynamicNotification[] = [
  {
    id: 'notif-1',
    title: '🎉 Early Bird Discount: 25% Off Hackathon Passes',
    body: 'Exclusive student discount available on Encore Hackathon passes. Limited passes available!',
    timestamp: 'Just now',
    type: 'discount',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: '📜 Certificate Issued: Encore Hackathon 2026',
    body: 'Congratulations! Your official Certificate of Participation has been issued (ID: CERT-1-CS-2026-01). Tap to view.',
    timestamp: '1h ago',
    type: 'certificate',
    read: false,
    certificateId: 'CERT-1-CS-2026-01',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    title: '⏰ Event Reminder: Hackathon starts soon',
    body: 'Get ready for Encore Hackathon 2026! Venue: CL-1 Auditorium.',
    timestamp: '3h ago',
    type: 'reminder',
    read: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'notif-4',
    title: '📢 Venue Update: Cultural Night Gala',
    body: 'Cultural Night venue updated to Open Air Theatre. Doors open at 5:30 PM.',
    timestamp: 'Yesterday',
    type: 'update',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * Gets all dynamic notifications.
 */
export async function getDynamicNotifications(): Promise<DynamicNotification[]> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_DYNAMIC_NOTIFICATIONS));
    return DEFAULT_DYNAMIC_NOTIFICATIONS;
  } catch (err) {
    console.warn('Failed to load notifications from storage:', err);
    return DEFAULT_DYNAMIC_NOTIFICATIONS;
  }
}

/**
 * Adds a new dynamic notification.
 */
export async function addDynamicNotification(
  notifData: Omit<DynamicNotification, 'id' | 'timestamp' | 'read' | 'createdAt'>
): Promise<DynamicNotification> {
  const list = await getDynamicNotifications();
  const newNotif: DynamicNotification = {
    ...notifData,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: 'Just now',
    read: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [newNotif, ...list];
  await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  return newNotif;
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const list = await getDynamicNotifications();
  const updated = list.map((item) => (item.id === id ? { ...item, read: true } : item));
  await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Clears all notifications.
 */
export async function clearAllNotifications(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
}

/**
 * Generates periodic dynamic notifications automatically based on event updates & preferences.
 */
export async function triggerRegularNotificationCheck(userCategoryPreferences?: string[]): Promise<DynamicNotification | null> {
  try {
    const list = await getDynamicNotifications();
    
    // Check if the last notification was generated in the last 2 minutes to prevent spamming
    if (list.length > 0) {
      const lastTime = new Date(list[0].createdAt).getTime();
      if (Date.now() - lastTime < 120000) {
        return null;
      }
    }

    const dynamicTemplates = [
      {
        title: '⚡ Instant Alert: 30% Off Tech Workshop Tickets',
        body: 'Special student discount available for AI/ML Hands-on Workshop today. Claim before seats run out!',
        type: 'discount' as const,
      },
      {
        title: '🎟️ Limited Seats Remaining!',
        body: 'Cultural Night Gala has only 40 seats remaining. Reserve your spot before registration closes.',
        type: 'reminder' as const,
      },
      {
        title: '📢 New Admin Announcement Posted',
        body: 'Admin team has published new updates regarding upcoming campus events and ticket passes.',
        type: 'update' as const,
      },
      {
        title: '🏆 Sports Tournament Registration Open',
        body: 'College Sports Meet 2026 track & field entries are now live! Free registration for all students.',
        type: 'reminder' as const,
      },
    ];

    const randomIndex = Math.floor(Math.random() * dynamicTemplates.length);
    const template = dynamicTemplates[randomIndex];

    return await addDynamicNotification(template);
  } catch (err) {
    console.warn('Regular notification trigger failed:', err);
    return null;
  }
}
