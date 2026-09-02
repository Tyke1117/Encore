import { getAuth } from '@react-native-firebase/auth';

export interface CreateEventInputData {
  title: string;
  category: string;
  tags?: string[];
  coverImage?: string | null;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue?: string;
  isVirtual?: boolean;
  ticketType: 'free' | 'paid' | 'invite';
  ticketPrice?: string | number;
  ticketQuantity: number;
  ticketName?: string;
  enableWaitlist?: boolean;
  isTransferable?: boolean;
}

export interface FirestoreEventDocument {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string | null;
  organizerId: string;
  startAt: string; // ISO String for Firestore Timestamp
  endAt: string;   // ISO String for Firestore Timestamp
  expiresAt: string; // ISO String: 2 days (48h) after endAt
  timezone: string;
  location: {
    venueName: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  isVirtual: boolean;
  ticket: {
    type: 'free' | 'paid' | 'invite';
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
    enableWaitlist: boolean;
    isTransferable: boolean;
  };
  status: 'published' | 'draft' | 'cancelled';
  source: 'organizer';
  externalId: null;
  createdAt: string;
  updatedAt: string;
}

const FIREBASE_PROJECT_ID = 'encore-6a677';

/**
 * Generates a unique 20-character alphanumeric Firestore document ID.
 */
function generateFirestoreId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

/**
 * Parses date string ("DD-MM-YYYY" or "YYYY-MM-DD") and time ("HH:mm") into an ISO timestamp string.
 */
export function parseDateTimeToISO(dateStr: string, timeStr: string): string {
  try {
    let year = new Date().getFullYear();
    let month = 0;
    let day = 1;

    const cleanDate = (dateStr || '').trim();
    if (cleanDate.includes('-') || cleanDate.includes('/')) {
      const parts = cleanDate.split(/[-/]/).map((p) => parseInt(p, 10));
      if (parts.length === 3) {
        if (parts[0] > 1000) {
          // Format: YYYY-MM-DD
          year = parts[0];
          month = parts[1] - 1;
          day = parts[2];
        } else {
          // Format: DD-MM-YYYY
          day = parts[0];
          month = parts[1] - 1;
          year = parts[2];
        }
      }
    }

    let hours = 0;
    let minutes = 0;
    if (timeStr) {
      const timeParts = timeStr.trim().split(':').map((p) => parseInt(p, 10));
      if (timeParts.length >= 2) {
        hours = isNaN(timeParts[0]) ? 0 : timeParts[0];
        minutes = isNaN(timeParts[1]) ? 0 : timeParts[1];
      }
    }

    const dateObj = new Date(year, month, day, hours, minutes, 0, 0);
    return dateObj.toISOString();
  } catch (error) {
    console.warn('Failed to parse date/time into ISO, defaulting to current time:', error);
    return new Date().toISOString();
  }
}

/**
 * Converts JavaScript primitive/nested objects into Firestore REST API value format.
 */
function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        fields[key] = { integerValue: val.toString() };
      } else {
        fields[key] = { doubleValue: val };
      }
    } else if (typeof val === 'string') {
      // Check if it represents an ISO date for Timestamp fields
      if (
        (key.endsWith('At') || key.endsWith('Date') || key === 'createdAt' || key === 'updatedAt' || key === 'expiresAt') &&
        val.endsWith('Z') &&
        !isNaN(Date.parse(val))
      ) {
        fields[key] = { timestampValue: val };
      } else {
        fields[key] = { stringValue: val };
      }
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map((item) => {
            if (typeof item === 'string') return { stringValue: item };
            if (typeof item === 'number') return { integerValue: item.toString() };
            if (typeof item === 'boolean') return { booleanValue: item };
            return { stringValue: String(item) };
          }),
        },
      };
    } else if (typeof val === 'object') {
      fields[key] = {
        mapValue: {
          fields: toFirestoreFields(val),
        },
      };
    }
  }

  return fields;
}

/**
 * Publishes an event to Cloud Firestore under the "events" collection.
 * 
 * Works 100% in pure JavaScript (`npm start` / Expo Go / Web / Native)
 * with zero native build/TurboModule dependency!
 * 
 * @param eventData - Combined data collected across the 3 event creation screens
 * @param organizerId - UID of the currently authenticated Firebase user
 * @returns Generated unique Firestore document ID (eventId)
 */
export async function publishEvent(
  eventData: CreateEventInputData,
  organizerId: string
): Promise<string> {
  if (!organizerId) {
    throw new Error('Organizer authentication is required to publish an event.');
  }

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const idToken = currentUser ? await currentUser.getIdToken(true) : null;

  const eventId = generateFirestoreId();

  const startISO = parseDateTimeToISO(
    eventData.startDate || '24-10-2024',
    eventData.startTime || '19:00'
  );
  const endISO = parseDateTimeToISO(
    eventData.endDate || eventData.startDate || '24-10-2024',
    eventData.endTime || '22:00'
  );
  
  // Calculate expiration date: 2 days (48 hours) after endAt
  const endTimestamp = new Date(endISO).getTime();
  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
  const expiresISO = new Date(endTimestamp + TWO_DAYS_MS).toISOString();

  const nowISO = new Date().toISOString();

  const priceNum =
    eventData.ticketType === 'free'
      ? 0
      : typeof eventData.ticketPrice === 'number'
      ? eventData.ticketPrice
      : parseFloat(eventData.ticketPrice || '0') || 0;

  const quantityNum = Number(eventData.ticketQuantity) || 100;

  const eventDocumentData: FirestoreEventDocument = {
    id: eventId,
    title: (eventData.title || 'Untitled Event').trim(),
    category: eventData.category || 'General',
    tags: Array.isArray(eventData.tags) ? eventData.tags : [],
    description: (eventData.description || '').trim(),
    coverImage: eventData.coverImage || null,

    organizerId,

    startAt: startISO,
    endAt: endISO,
    expiresAt: expiresISO,
    timezone: 'Asia/Kolkata',

    location: {
      venueName: eventData.isVirtual
        ? 'Virtual Event'
        : (eventData.venue || 'TBA').trim(),
      address: null,
      city: null,
      state: null,
      country: null,
      latitude: null,
      longitude: null,
    },

    isVirtual: !!eventData.isVirtual,

    ticket: {
      type: eventData.ticketType || 'free',
      name: (eventData.ticketName || 'General Admission').trim(),
      price: priceNum,
      quantity: quantityNum,
      availableQuantity: quantityNum,
      enableWaitlist: !!eventData.enableWaitlist,
      isTransferable: eventData.isTransferable !== false,
    },

    status: 'published',
    source: 'organizer',
    externalId: null,

    createdAt: nowISO,
    updatedAt: nowISO,
  };

  const firestorePayload = {
    fields: toFirestoreFields(eventDocumentData),
  };

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/events?documentId=${eventId}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(firestorePayload),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message =
      errorJson?.error?.message ||
      `Firestore request failed with HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return eventId;
}

/**
 * Scans and deletes events from Firestore that have exceeded their 2-day expiration window.
 * 
 * @returns Count of deleted expired events
 */
export async function cleanupExpiredEvents(): Promise<number> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const idToken = currentUser ? await currentUser.getIdToken() : null;

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/events`;
    
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) return 0;

    const data = await response.json();
    const documents: any[] = data.documents || [];
    const nowTime = Date.now();
    let deletedCount = 0;

    for (const doc of documents) {
      const expiresAtVal =
        doc.fields?.expiresAt?.timestampValue ||
        doc.fields?.expiresAt?.stringValue;

      if (expiresAtVal) {
        const expiresTime = new Date(expiresAtVal).getTime();
        if (expiresTime <= nowTime) {
          const deleteUrl = `https://firestore.googleapis.com/v1/${doc.name}`;
          await fetch(deleteUrl, { method: 'DELETE', headers });
          deletedCount++;
        }
      }
    }
    return deletedCount;
  } catch (err) {
    console.warn('Expired events cleanup encountered an issue:', err);
    return 0;
  }
}
