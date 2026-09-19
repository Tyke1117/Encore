require("dotenv").config({ path: [".env", "../.env", "../backend/.env"] });
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

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
      console.log("[Firebase] Initialized using FIREBASE_SERVICE_ACCOUNT_KEY env var.");
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

function classifyEvent(title = "", description = "", existingCategories = []) {
  const categoriesArr = Array.isArray(existingCategories)
    ? existingCategories
    : typeof existingCategories === "string"
    ? [existingCategories]
    : [];

  const text = `${title} ${description} ${categoriesArr.join(" ")}`.toLowerCase();

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

async function categorizeAllExistingEvents() {
  console.log("Fetching existing events from Firestore...");
  const snapshot = await db.collection("events").get();
  console.log(`Found ${snapshot.size} events in Firestore.`);

  if (snapshot.empty) {
    console.log("No events to categorize.");
    return;
  }

  const batch = db.batch();
  let updatedCount = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const title = data.title || data.name || "";
    const description = data.description || "";
    const existingCat = data.category || [];

    const { primaryCategory, categories } = classifyEvent(title, description, existingCat);

    batch.update(doc.ref, {
      primaryCategory: primaryCategory,
      category: categories,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    updatedCount++;
  });

  await batch.commit();
  console.log(`Successfully categorized and updated ${updatedCount} events in Firestore!`);
}

categorizeAllExistingEvents().catch((err) => {
  console.error("Error categorizing events:", err);
  process.exit(1);
});
