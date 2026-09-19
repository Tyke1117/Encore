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
    } catch (e) {}
  }

  if (!credential) {
    for (const keyPath of possibleKeyPaths) {
      if (fs.existsSync(keyPath)) {
        try {
          const keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));
          credential = admin.credential.cert(keyData);
          break;
        } catch (e) {}
      }
    }
  }

  if (credential) {
    admin.initializeApp({ credential, projectId: "encore-6a677" });
  } else {
    admin.initializeApp({ projectId: "encore-6a677" });
  }

  return admin.firestore();
}

const db = initFirebase();

async function inspectEvents() {
  const snapshot = await db.collection("events").get();
  console.log(`Total events currently in Firestore: ${snapshot.size}`);

  const sources = {};
  const sampleDocs = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const src = data.source || (data.isExternal ? "external" : "organizer");
    sources[src] = (sources[src] || 0) + 1;

    sampleDocs.push({
      id: doc.id,
      title: data.title || data.name,
      source: src,
      startAt: data.startAt,
      expiresAt: data.expiresAt,
      lastFetchedAt: data.lastFetchedAt,
      createdAt: data.createdAt,
    });
  });

  console.log("Events by source breakdown:", sources);
  console.log("\nSample 10 events:");
  console.log(JSON.stringify(sampleDocs.slice(0, 10), null, 2));
}

inspectEvents().catch(console.error);
