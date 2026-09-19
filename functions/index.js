const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define secrets bound to functions
const TICKETMASTER_API_KEY = defineSecret("TICKETMASTER_API_KEY");
const INTERNAL_SYNC_SECRET = defineSecret("INTERNAL_SYNC_SECRET");

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

async function runIngestionPipeline({ tmApiKey }) {
  const summary = {
    timestamp: new Date().toISOString(),
    sources: {},
    totalUpserted: 0,
  };

  const normalizedEvents = [];

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

  if (normalizedEvents.length > 0) {
    const { written } = await writeEventsToFirestore(normalizedEvents);
    summary.totalUpserted = written;
  }

  return summary;
}

// Scheduled Function (Daily at 4:00 AM IST)
exports.ingestExternalEventsDaily = onSchedule(
  {
    schedule: "0 4 * * *",
    timeZone: "Asia/Kolkata",
    secrets: [TICKETMASTER_API_KEY],
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (event) => {
    console.log("[Scheduler] Starting daily Ticketmaster event ingestion...");
    let tmApiKey = null;
    try { tmApiKey = TICKETMASTER_API_KEY.value(); } catch (_) {}

    const summary = await runIngestionPipeline({ tmApiKey });
    console.log("[Scheduler] Ingestion completed:", JSON.stringify(summary));
    return summary;
  }
);

// Manual Protected Endpoint for testing
exports.manualIngestEvents = onRequest(
  {
    secrets: [TICKETMASTER_API_KEY, INTERNAL_SYNC_SECRET],
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (req, res) => {
    let expectedSecret = "";
    try { expectedSecret = INTERNAL_SYNC_SECRET.value(); } catch (_) {}

    if (expectedSecret) {
      const providedSecret = req.headers["x-sync-secret"] || req.query.secret;
      if (providedSecret !== expectedSecret) {
        res.status(401).json({ error: "Unauthorized: Invalid or missing sync secret." });
        return;
      }
    }

    let tmApiKey = null;
    try { tmApiKey = TICKETMASTER_API_KEY.value(); } catch (_) {}

    try {
      const summary = await runIngestionPipeline({ tmApiKey });
      res.status(200).json({ status: "success", summary });
    } catch (err) {
      console.error("[Manual Trigger] Error:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);
