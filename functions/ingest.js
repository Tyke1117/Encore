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
    // Default application credentials fallback
    console.log("[Firebase] Initializing with default project credentials (encore-6a677)...");
    admin.initializeApp({
      projectId: "encore-6a677",
    });
  }

  return admin.firestore();
}

const db = initFirebase();

// Constants
const PARSE_BOT_SCRAPER_ID = "c9d4d699-5bca-49af-a878-144ad05b0f5f";
const DEFAULT_CITY_SLUG = process.env.BOOKMYSHOW_CITY_SLUG || "ahmedabad";
const DEFAULT_CITY_NAME = "Ahmedabad";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function safeParseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return admin.firestore.Timestamp.fromDate(parsed);
}

/**
 * Fetch Parse.bot BookMyShow events with timeout and safe retries
 */
async function fetchParseBotEvents(apiKey, citySlug = DEFAULT_CITY_SLUG) {
  const url = `https://api.parse.bot/scraper/${PARSE_BOT_SCRAPER_ID}/get_events_list?city=${encodeURIComponent(
    citySlug
  )}`;

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[Parse.bot] Fetching events for city "${citySlug}" (attempt ${attempt + 1}/${maxRetries + 1})...`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
          `Parse.bot API returned status ${response.status} ${response.statusText}: ${errorBody}`
        );
      }

      const json = await response.json();
      const items = json?.data?.items || json?.items || [];
      console.log(`[Parse.bot] Successfully fetched ${items.length} raw events.`);
      return items;
    } catch (err) {
      lastError = err;
      console.warn(
        `[Parse.bot] Request attempt ${attempt + 1} failed: ${err.message}`
      );
      if (attempt < maxRetries) {
        await sleep(2000 * (attempt + 1));
      }
    }
  }

  throw new Error(`Parse.bot fetch failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
}

/**
 * Normalize a Parse.bot BookMyShow event into the standard Firestore schema
 */
function normalizeParseBotEvent(item, cityName = DEFAULT_CITY_NAME) {
  const externalId = item.event_code ? String(item.event_code).trim() : null;
  if (!externalId) {
    return null;
  }

  const category = item.genre
    ? String(item.genre)
        .split("|")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const languages = item.language
    ? String(item.language)
        .split("|")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const docId = `bms_${externalId}`;

  const docData = {
    title: item.title ? String(item.title).trim() : "Untitled Event",
    description: item.description ? String(item.description).trim() : null,
    category: category,
    languages: languages,
    startAt: safeParseDate(item.event_date),
    city: cityName,
    venue: item.venue ? String(item.venue).trim() : null,
    imageUrl: item.poster_url ? String(item.poster_url).trim() : null,
    registrationUrl: item.cta_url ? String(item.cta_url).trim() : null,
    sourceUrl: item.cta_url ? String(item.cta_url).trim() : null,
    source: "bookmyshow",
    sourceType: "external",
    externalId: externalId,
    isExternal: true,
    lastFetchedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  return { docId, docData };
}

/**
 * Fetch Ticketmaster events (Optional)
 */
async function fetchTicketmasterEvents(apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    console.log("[Ticketmaster] No API key configured. Skipping Ticketmaster ingestion.");
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
 * Normalize Ticketmaster event
 */
function normalizeTicketmasterEvent(item) {
  const externalId = item.id ? String(item.id).trim() : null;
  if (!externalId) return null;

  const venue = item._embedded?.venues?.[0];
  const classifications = item.classifications?.[0];
  const categories = [];

  if (classifications?.segment?.name) {
    categories.push(classifications.segment.name.toLowerCase());
  }
  if (classifications?.genre?.name) {
    categories.push(classifications.genre.name.toLowerCase());
  }

  let imageUrl = null;
  if (Array.isArray(item.images) && item.images.length > 0) {
    const sorted = [...item.images].sort((a, b) => (b.width || 0) - (a.width || 0));
    imageUrl = sorted[0]?.url || null;
  }

  const startAt = safeParseDate(item.dates?.start?.dateTime || item.dates?.start?.localDate);
  const docId = `tm_${externalId}`;

  const docData = {
    title: item.name ? String(item.name).trim() : "Untitled Event",
    description: item.info || item.pleaseNote || null,
    category: categories,
    languages: [],
    startAt: startAt,
    city: venue?.city?.name || null,
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

  const BATCH_SIZE = 400; // Under Firestore 500 limit
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
  console.log("   Encore Event Ingestion (Spark / Standalone)    ");
  console.log("==================================================");

  const parseApiKey = process.env.PARSE_BOT_API_KEY;
  const tmApiKey = process.env.TICKETMASTER_API_KEY;
  const citySlug = DEFAULT_CITY_SLUG;

  if (!parseApiKey) {
    console.error("❌ ERROR: PARSE_BOT_API_KEY is not set in environment or .env file.");
    process.exit(1);
  }

  const normalizedEvents = [];

  // 1. Parse.bot Fetch
  try {
    const rawBms = await fetchParseBotEvents(parseApiKey, citySlug);
    const bmsNormalized = rawBms
      .map((item) => normalizeParseBotEvent(item, DEFAULT_CITY_NAME))
      .filter(Boolean);

    console.log(`✅ [Parse.bot] Normalized ${bmsNormalized.length} events.`);
    normalizedEvents.push(...bmsNormalized);
  } catch (err) {
    console.error("❌ [Parse.bot] Error during ingestion:", err.message);
  }

  // 2. Ticketmaster Fetch (Optional)
  if (tmApiKey) {
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

  // 3. Write to Firestore
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
