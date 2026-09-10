const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define secrets bound to functions
const PARSE_BOT_API_KEY = defineSecret("PARSE_BOT_API_KEY");
const TICKETMASTER_API_KEY = defineSecret("TICKETMASTER_API_KEY");
const INTERNAL_SYNC_SECRET = defineSecret("INTERNAL_SYNC_SECRET");

// Parse.bot scraper constants
const PARSE_BOT_SCRAPER_ID = "c9d4d699-5bca-49af-a878-144ad05b0f5f";
const DEFAULT_CITY_SLUG = "ahmedabad";
const DEFAULT_CITY_NAME = "Ahmedabad";

/**
 * Helper to pause execution
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely parse date or return null if invalid/missing
 */
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
 * Fetch Ticketmaster events (Optional - runs only if TICKETMASTER_API_KEY exists)
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

  const BATCH_SIZE = 400; // Stay comfortably below Firestore's 500 limit
  let totalWritten = 0;

  for (let i = 0; i < normalizedEvents.length; i += BATCH_SIZE) {
    const chunk = normalizedEvents.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const { docId, docData } of chunk) {
      const docRef = db.collection("events").doc(docId);
      // Use merge: true so previous good data is preserved and document isn't clobbered
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
 * Core orchestration logic for event ingestion
 */
async function runIngestionPipeline({ parseApiKey, tmApiKey, citySlug = DEFAULT_CITY_SLUG }) {
  const summary = {
    timestamp: new Date().toISOString(),
    city: citySlug,
    sources: {},
    totalUpserted: 0,
  };

  const normalizedEvents = [];

  // 1. Fetch Parse.bot (BookMyShow)
  if (parseApiKey) {
    try {
      const rawBms = await fetchParseBotEvents(parseApiKey, citySlug);
      const bmsNormalized = rawBms
        .map((item) => normalizeParseBotEvent(item, DEFAULT_CITY_NAME))
        .filter(Boolean);

      summary.sources.bookmyshow = {
        fetched: rawBms.length,
        normalized: bmsNormalized.length,
        status: "success",
      };
      normalizedEvents.push(...bmsNormalized);
    } catch (err) {
      console.error("[Parse.bot] Ingestion failed:", err);
      summary.sources.bookmyshow = {
        status: "error",
        error: err.message,
      };
    }
  } else {
    summary.sources.bookmyshow = {
      status: "skipped",
      reason: "PARSE_BOT_API_KEY secret not found or empty",
    };
  }

  // 2. Fetch Ticketmaster (Independent - optional)
  if (tmApiKey) {
    try {
      const rawTm = await fetchTicketmasterEvents(tmApiKey);
      const tmNormalized = rawTm
        .map((item) => normalizeTicketmasterEvent(item))
        .filter(Boolean);

      summary.sources.ticketmaster = {
        fetched: rawTm.length,
        normalized: tmNormalized.length,
        status: "success",
      };
      normalizedEvents.push(...tmNormalized);
    } catch (err) {
      console.error("[Ticketmaster] Ingestion failed:", err);
      summary.sources.ticketmaster = {
        status: "error",
        error: err.message,
      };
    }
  } else {
    summary.sources.ticketmaster = {
      status: "skipped",
      reason: "TICKETMASTER_API_KEY not configured",
    };
  }

  // 3. Batch write to Cloud Firestore
  if (normalizedEvents.length > 0) {
    const { written } = await writeEventsToFirestore(normalizedEvents);
    summary.totalUpserted = written;
  }

  return summary;
}

// =========================================================================
// 1. Scheduled Ingestion Function (Daily at 4:00 AM IST)
// =========================================================================
exports.ingestExternalEventsDaily = onSchedule(
  {
    schedule: "0 4 * * *", // Everyday at 04:00 AM
    timeZone: "Asia/Kolkata",
    secrets: [PARSE_BOT_API_KEY, TICKETMASTER_API_KEY],
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (event) => {
    console.log("[Scheduler] Starting daily external event ingestion...");

    const parseApiKey = PARSE_BOT_API_KEY.value();
    let tmApiKey = null;
    try {
      tmApiKey = TICKETMASTER_API_KEY.value();
    } catch (_) {
      // optional
    }

    const summary = await runIngestionPipeline({
      parseApiKey,
      tmApiKey,
      citySlug: DEFAULT_CITY_SLUG,
    });

    console.log("[Scheduler] Ingestion completed:", JSON.stringify(summary));
    return summary;
  }
);

// =========================================================================
// 2. Manual / Protected Ingestion Endpoint (For one-off testing)
// =========================================================================
exports.manualIngestEvents = onRequest(
  {
    secrets: [PARSE_BOT_API_KEY, TICKETMASTER_API_KEY, INTERNAL_SYNC_SECRET],
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (req, res) => {
    // Basic protection: check for x-sync-secret header or query param if INTERNAL_SYNC_SECRET is set
    let expectedSecret = "";
    try {
      expectedSecret = INTERNAL_SYNC_SECRET.value();
    } catch (_) {
      // not set
    }

    if (expectedSecret) {
      const providedSecret = req.headers["x-sync-secret"] || req.query.secret;
      if (providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized: Invalid or missing sync secret." });
        return;
      }
    }

    const parseApiKey = PARSE_BOT_API_KEY.value();
    let tmApiKey = null;
    try {
      tmApiKey = TICKETMASTER_API_KEY.value();
    } catch (_) {
      // optional
    }

    const citySlug = req.query.city || DEFAULT_CITY_SLUG;

    try {
      const summary = await runIngestionPipeline({
        parseApiKey,
        tmApiKey,
        citySlug,
      });
      res.status(200).json({ status: "success", summary });
    } catch (err) {
      console.error("[Manual Trigger] Error:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);
