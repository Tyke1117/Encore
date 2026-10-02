require("dotenv").config({ path: [".env", "../.env", "../backend/.env"] });
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const possibleKeyPaths = [
    path.join(__dirname, "serviceAccountKey.json"),
    path.join(__dirname, "..", "serviceAccountKey.json"),
  ];

  let credential = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = admin.credential.cert(parsed);
      console.log("[Firebase] Initialized using FIREBASE_SERVICE_ACCOUNT_KEY environment variable.");
    } catch (e) {
      console.error("[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY env var:", e.message);
    }
  }

  if (!credential) {
    for (const keyPath of possibleKeyPaths) {
      if (fs.existsSync(keyPath)) {
        try {
          const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));
          credential = admin.credential.cert(keyData);
          console.log(`[Firebase] Initialized using service account file at: ${path.basename(keyPath)}`);
          break;
        } catch (e) {
          console.error(`[Firebase] Could not read key from ${keyPath}:`, e.message);
        }
      }
    }
  }

  if (credential) {
    admin.initializeApp({
      credential,
      projectId: "encore-6a677",
    });
  } else {
    console.log("[Firebase] Initializing with default project credentials (encore-6a677)...");
    admin.initializeApp({
      projectId: "encore-6a677",
    });
  }

  return admin.firestore();
}

const db = initFirebase();

function safeParseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return admin.firestore.Timestamp.fromDate(parsed);
}

/**
 * Fetch Ticketmaster events
 */
async function fetchTicketmasterEvents(apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    console.log("[Ticketmaster] No TICKETMASTER_API_KEY provided in environment.");
    return [];
  }

  try {
    console.log("[Ticketmaster] Fetching upcoming events...");
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${encodeURIComponent(
      apiKey.trim()
    )}&size=50&sort=date,asc`;

    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.warn(`[Ticketmaster] API returned status ${response.status} ${response.statusText}`);
      return [];
    }

    const json = await response.json();
    const events = json?._embedded?.events || [];
    console.log(`[Ticketmaster] Successfully fetched ${events.length} raw events.`);
    return events;
  } catch (err) {
    console.warn(`[Ticketmaster] Ingestion warning: ${err.message}`);
    return [];
  }
}

/**
 * Fetch Brabble events
 */
async function fetchBrabbleEvents(apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    console.log("[Brabble] No BRABBLE_API_KEY provided in environment.");
    return [];
  }

  try {
    console.log("[Brabble] Fetching upcoming hackathons & competitions...");
    const url = process.env.BRABBLE_API_URL || "https://brabble.ai/api/listings?hub=hackathons&limit=50";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey.trim(),
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.warn(`[Brabble] API returned status ${response.status} ${response.statusText}`);
      return [];
    }

    const json = await response.json();
    const listings = Array.isArray(json) ? json : (json?.listings || json?.data || json?.events || []);
    console.log(`[Brabble] Successfully fetched ${listings.length} raw listings.`);
    return listings;
  } catch (err) {
    console.warn(`[Brabble] Ingestion warning: ${err.message}`);
    return [];
  }
}

function normalizeBrabbleEvent(item) {
  const externalId = item.id || item._id || item.slug;
  if (!externalId) return null;

  const title = item.title || item.name || "Untitled Hackathon";
  const description = item.description || item.summary || "";
  const { primaryCategory, categories } = classifyEvent(title, description, ["tech", "hackathon", "competition"]);

  let startAt = safeParseDate(item.startDate || item.startAt || item.deadline || item.submissionDeadline);
  if (!startAt) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    startAt = admin.firestore.Timestamp.fromDate(d);
  }

  const isOnline = item.isVirtual !== undefined ? Boolean(item.isVirtual) : (item.mode?.toLowerCase() === "online" || !item.venue);
  const venue = isOnline ? "Online / Remote" : (item.venue || "Campus / Venue TBA");
  const city = item.city || (isOnline ? "Online" : "National");

  const docId = `brbl_${externalId}`;
  const docData = {
    title: title,
    description: description || null,
    primaryCategory: primaryCategory || "tech",
    category: categories.length > 0 ? categories : ["tech"],
    languages: [],
    startAt: startAt,
    city: city,
    venue: venue,
    imageUrl: item.image || item.banner || item.logo || null,
    registrationUrl: item.registrationUrl || item.applyUrl || item.url || "https://brabble.ai",
    sourceUrl: item.url || item.website || "https://brabble.ai",
    source: "brabble",
    sourceType: "external",
    externalId: String(externalId),
    isExternal: true,
    lastFetchedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  return { docId, docData };
}

/**
 * Automatic Event Category Classifier
 */
function classifyEvent(title = "", description = "", rawCategories = []) {
  const text = `${title} ${description} ${rawCategories.join(" ")}`.toLowerCase();

  const rules = [
    {
      category: "music",
      keywords: ["music", "concert", "dj", "band", "sing", "live music", "orchestra", "singer", "edm", "rock", "jazz", "acoustic", "gig", "fest", "musical", "instrumental", "hip hop", "rap", "pop", "symphony", "qawwali", "bollywood night"]
    },
    {
      category: "entertainment",
      keywords: ["comedy", "stand-up", "standup", "theatre", "theater", "play", "magic", "circus", "improv", "movie", "screening", "show", "open mic", "drama", "laughter"]
    },
    {
      category: "sports",
      keywords: ["sport", "sports", "cricket", "football", "soccer", "marathon", "run", "race", "fitness", "yoga", "tournament", "match", "badminton", "esports", "gaming", "league", "zumba"]
    },
    {
      category: "cultural",
      keywords: ["art", "exhibition", "craft", "pottery", "painting", "workshop", "dance", "cultural", "heritage", "walk", "photography", "sculpture", "literature", "drawing", "exhibit"]
    },
    {
      category: "tech",
      keywords: ["tech", "technology", "conference", "hackathon", "meetup", "webinar", "developer", "coding", "software", "ai", "startup", "data", "cloud", "business", "networking", "summit"]
    },
    {
      category: "food_nightlife",
      keywords: ["food", "drink", "drinks", "dining", "wine", "beer", "tasting", "party", "club", "nightlife", "pub", "bazaar", "flea market", "culinary", "brunch", "cocktail", "bar"]
    }
  ];

  const matched = new Set();
  let primaryCategory = null;

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      matched.add(rule.category);
      if (!primaryCategory) primaryCategory = rule.category;
    }
  }

  if (matched.size === 0) {
    matched.add("cultural");
    primaryCategory = "cultural";
  }

  return {
    primaryCategory,
    categories: Array.from(matched)
  };
}

/**
 * Normalize Ticketmaster event
 */
function normalizeTicketmasterEvent(item) {
  const externalId = item.id ? String(item.id).trim() : null;
  if (!externalId) return null;

  const venue = item._embedded?.venues?.[0];
  const classifications = item.classifications?.[0];
  const rawCategories = [];

  if (classifications?.segment?.name) {
    rawCategories.push(classifications.segment.name.toLowerCase());
  }
  if (classifications?.genre?.name) {
    rawCategories.push(classifications.genre.name.toLowerCase());
  }

  const title = item.name ? String(item.name).trim() : "Untitled Event";
  const description = item.info || item.pleaseNote || "";

  const { primaryCategory, categories } = classifyEvent(title, description, rawCategories);

  let imageUrl = null;
  if (Array.isArray(item.images) && item.images.length > 0) {
    const sorted = [...item.images].sort((a, b) => (b.width || 0) - (a.width || 0));
    imageUrl = sorted[0]?.url || null;
  }

  const startAt = safeParseDate(item.dates?.start?.dateTime || item.dates?.start?.localDate);
  const docId = `tm_${externalId}`;

  const docData = {
    title: title,
    description: description || null,
    primaryCategory: primaryCategory,
    category: categories,
    languages: [],
    startAt: startAt,
    city: venue?.city?.name || "Global",
    venue: venue?.name || null,
    imageUrl: imageUrl,
    registrationUrl: item.url || null,
    sourceUrl: item.url || null,
    source: "ticketmaster",
    sourceType: "external",
    externalId: externalId,
    isExternal: true,
    lastFetchedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  return { docId, docData };
}

/**
 * Write normalized events to Firestore in batches
 */
async function writeEventsToFirestore(normalizedEvents) {
  if (!normalizedEvents || normalizedEvents.length === 0) {
    return { written: 0 };
  }

  const BATCH_SIZE = 400;
  let totalWritten = 0;

  for (let i = 0; i < normalizedEvents.length; i += BATCH_SIZE) {
    const chunk = normalizedEvents.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const { docId, docData } of chunk) {
      const docRef = db.collection("events").doc(docId);
      batch.set(
        docRef,
        {
          ...docData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    await batch.commit();
    totalWritten += chunk.length;
    console.log(`[Firestore] Committed batch of ${chunk.length} events (${totalWritten}/${normalizedEvents.length}).`);
  }

  return { written: totalWritten };
}

/**
 * Main Runner Function
 */
async function main() {
  console.log("==================================================");
  console.log("   Encore Event Ingestion (Ticketmaster & Brabble)");
  console.log("==================================================");

  const tmApiKey = process.env.TICKETMASTER_API_KEY;
  const brblApiKey = process.env.BRABBLE_API_KEY;

  if ((!tmApiKey || tmApiKey.trim() === "") && (!brblApiKey || brblApiKey.trim() === "")) {
    console.error("❌ ERROR: Neither TICKETMASTER_API_KEY nor BRABBLE_API_KEY is set.");
    console.log("Please add at least one API key to your .env file or environment.");
    process.exit(1);
  }

  const normalizedEvents = [];

  // Ticketmaster Fetch
  if (tmApiKey && tmApiKey.trim() !== "") {
    try {
      const rawTm = await fetchTicketmasterEvents(tmApiKey);
      const tmNormalized = rawTm
        .map((item) => normalizeTicketmasterEvent(item))
        .filter(Boolean);

      console.log(`✅ [Ticketmaster] Normalized ${tmNormalized.length} events.`);
      normalizedEvents.push(...tmNormalized);
    } catch (err) {
      console.warn("⚠️ [Ticketmaster] Warning during ingestion:", err.message);
    }
  }

  // Brabble Fetch
  if (brblApiKey && brblApiKey.trim() !== "") {
    try {
      const rawBrbl = await fetchBrabbleEvents(brblApiKey);
      const brblNormalized = rawBrbl
        .map((item) => normalizeBrabbleEvent(item))
        .filter(Boolean);

      console.log(`✅ [Brabble] Normalized ${brblNormalized.length} events.`);
      normalizedEvents.push(...brblNormalized);
    } catch (err) {
      console.warn("⚠️ [Brabble] Warning during ingestion:", err.message);
    }
  }

  // Write to Firestore
  if (normalizedEvents.length > 0) {
    console.log(`[Firestore] Writing ${normalizedEvents.length} events to 'events' collection...`);
    const { written } = await writeEventsToFirestore(normalizedEvents);
    console.log(`🎉 [Firestore] Successfully wrote/updated ${written} documents.`);
  } else {
    console.log("ℹ️ No events to write to Firestore.");
  }

  console.log("==================================================");
  console.log("               Ingestion Complete                 ");
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Unhandled error in ingestion script:", err);
  process.exit(1);
});
