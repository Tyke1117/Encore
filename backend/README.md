# Encore Event Ingestion Backend

> **Architecture Note:** This backend is built purely on **in-memory RAM caching and atomic JSON Lines text-file storage**. It does **NOT** use MongoDB, PostgreSQL, SQLite, MySQL, Firebase Firestore, Redis, Supabase, Prisma, or any other database service.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Setup (Windows PowerShell)](#quick-setup-windows-powershell)
4. [Environment Configuration & API Keys](#environment-configuration--api-keys)
5. [Running Event Ingestion](#running-event-ingestion)
6. [Inspecting Output Text Files](#inspecting-output-text-files)
7. [Testing API Endpoints](#testing-api-endpoints)
8. [Connecting the React Native / Expo Frontend](#connecting-the-react-native--expo-frontend)
9. [Verifying Zero Database Usage](#verifying-zero-database-usage)
10. [Troubleshooting & Common Errors](#troubleshooting--common-errors)

---

## Overview

The Encore Event Ingestion prototype fetches events from external sources (Ticketmaster, TheSportsDB, RSS feeds, ICS calendar feeds) and accepts internal events from Encore organizers.

**Target Data Flow:**
```
External Sources (Ticketmaster, SportsDB, RSS, ICS)
       │
       ▼
   Background Fetch (Sequential / Controlled Concurrency)
       │
       ▼
   Hold Raw Responses Temporarily in RAM
       │
       ▼
   Validate & Normalize to Canonical Encore Format
       │
       ├── Invalid / Corrupt ──► Quarantine Snapshot (.txt)
       │
       ▼
   Deduplicate (Exact ID & SHA-256 Fingerprint)
       │
       ▼
   Combine with Published Organizer Events
       │
       ▼
   Write Atomically to Normalized Output (events_latest.txt)
       │
       ▼
   In-Memory Cache (RAM) Serves Fast GET /api/events
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **OS**: Windows (PowerShell commands demonstrated below)

---

## Quick Setup (Windows PowerShell)

Open **PowerShell** and navigate to the `backend` folder:

```powershell
# 1. Navigate to the backend directory
cd C:\Users\Aashwi\Downloads\encore_antigravity\backend

# 2. Install dependencies
npm install

# 3. Copy .env.example to .env
Copy-Item .env.example .env

# 4. Generate and configure a strong sync secret
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
(Get-Content .env) -replace 'INTERNAL_SYNC_SECRET=.*', "INTERNAL_SYNC_SECRET=$secret" | Set-Content .env

# 5. Run test suite
npm test
```

---

## Environment Configuration & API Keys

Open `.env` in your text editor:

```powershell
notepad .env
```

### Provider Details & Where to Obtain Keys

| Provider | Purpose | Official Signup URL | Env Variable | Free Tier / Limits |
|---|---|---|---|---|
| **Ticketmaster** | Concerts, Sports, Theatre, Festivals | [developer.ticketmaster.com](https://developer.ticketmaster.com/) | `TICKETMASTER_API_KEY` | 5 req/sec, 5,000 req/day |
| **TheSportsDB** | Cricket, Football, Basketball, Motorsport | [thesportsdb.com/api.php](https://www.thesportsdb.com/api.php) | `SPORTSDB_API_KEY` | Free dev key (`3`), Patreon for full tier |
| **RSS Feeds** | College, Uni, Public calendars | N/A (Public XML/RSS URLs) | `RSS_FEED_URLS` | Comma-separated public URLs |
| **ICS Feeds** | iCal calendar subscriptions | N/A (Public `.ics` URLs) | `ICS_FEED_URLS` | Comma-separated public URLs |

> **Note on Zero-Configuration:** If an API key is left blank, that connector is gracefully marked as `disabled` and the backend continues running without crashing.

### Sample Configured `.env`
```ini
PORT=4000
NODE_ENV=development
INTERNAL_SYNC_SECRET=your-random-generated-secret-key-here

TICKETMASTER_API_KEY=
TICKETMASTER_COUNTRY_CODES=IN,US,GB,CA,AU
TICKETMASTER_HORIZON_DAYS=90
TICKETMASTER_MAX_PAGES=3

SPORTSDB_API_KEY=
SPORTSDB_LEAGUE_IDS=4328,4335

RSS_FEED_URLS=https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml
ICS_FEED_URLS=

ENABLE_LOCAL_SCHEDULER=true
SYNC_CRON=0 */6 * * *

RAW_RETENTION_DAYS=7
QUARANTINE_RETENTION_DAYS=7
REPORT_RETENTION_DAYS=14
```

---

## Running Event Ingestion

### Option A: Run One Manual Ingestion (Recommended for Testing)

Fetches all configured sources immediately, normalizes data, and updates text files:

```powershell
npm run fetch:events
```

Sample Terminal Summary:
```
═══════════════════════════════════════════
  ENCORE EVENT SYNC COMPLETED
═══════════════════════════════════════════

  Ticketmaster:
    Fetched: 0
    Valid:   0
    Duplicates: 0
    Quarantined: 0

  TheSportsDB:
    Fetched: 0
    Valid:   0
    Duplicates: 0
    Quarantined: 0

  Rss:
    Fetched: 25
    Valid:   25
    Duplicates: 0
    Quarantined: 0

  Ics:
    Fetched: 0
    Valid:   0
    Duplicates: 0
    Quarantined: 0

  Organizer events included: 2
  Final unique events: 27
  Output: backend/data/normalized/events_latest.txt
  Duration: 1.2 seconds
═══════════════════════════════════════════
```

### Option B: Run Scheduled Background Sync

Starts a scheduled process (defaults to every 6 hours):

```powershell
npm run start:events
```

### Option C: Start the HTTP REST API Server

```powershell
npm start
# Server will start on http://localhost:4000
```

---

## Inspecting Output Text Files

All data is stored in newline-delimited JSON Lines (`.txt`):

```powershell
# View latest normalized events
Get-Content .\data\normalized\events_latest.txt

# View organizer events
Get-Content .\data\organizer\organizer_events.txt

# View raw snapshots
Get-ChildItem .\data\raw\

# View sync reports
Get-ChildItem .\data\reports\

# View quarantined invalid events
Get-ChildItem .\data\quarantine\
```

---

## Testing API Endpoints

You can test endpoints directly using PowerShell `Invoke-RestMethod` or `curl`:

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/health" -Method Get
```
Response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "database": "none - text file storage only"
}
```

### 2. Fetch Events Feed (With Pagination & Filters)
```powershell
# Get first page of events
Invoke-RestMethod -Uri "http://localhost:4000/api/events?page=1&limit=10" -Method Get

# Filter by category
Invoke-RestMethod -Uri "http://localhost:4000/api/events?category=music" -Method Get

# Filter by country & city
Invoke-RestMethod -Uri "http://localhost:4000/api/events?countryCode=IN&city=Bangalore" -Method Get
```

### 3. Create Organizer Event
```powershell
$headers = @{
  "Content-Type" = "application/json"
  "x-organizer-id" = "org_user_98765"
}

$body = @{
  title = "AI & Music Summit 2026"
  description = "A full day conference exploring generative sound and music production."
  category = "technology"
  startAt = "2026-11-20T10:00:00.000Z"
  endAt = "2026-11-20T18:00:00.000Z"
  location = @{
    venue = "Digital Art Pavilion"
    city = "Bangalore"
    country = "India"
    countryCode = "IN"
  }
  ticket = @{
    type = "free"
    price = 0
    currency = "INR"
  }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/organizer/events" -Method Post -Headers $headers -Body $body
```

### 4. Trigger Internal Ingestion Sync via API
```powershell
$syncSecret = (Get-Content .env | Select-String 'INTERNAL_SYNC_SECRET=(.*)').Matches.Groups[1].Value

$headers = @{
  "x-sync-secret" = $syncSecret
}

Invoke-RestMethod -Uri "http://localhost:4000/api/internal/sync" -Method Post -Headers $headers
```

---

## Connecting the React Native / Expo Frontend

When ready to integrate with the mobile app frontend:

1. In the React Native app, configure the base URL (e.g. `http://10.0.2.2:4000` for Android emulator or `http://localhost:4000` for iOS simulator / web).
2. For organizer forms, send `POST /api/organizer/events` with header `x-organizer-id: <user_uid>`.
3. For event discovery, query `GET /api/events?page=1&limit=20`.

---

## Verifying Zero Database Usage

To verify that no database is running or queried:
1. Inspect `package.json`: No `mongoose`, `pg`, `mysql2`, `sqlite3`, `redis`, `prisma`, or `@prisma/client` are installed.
2. Inspect `backend/data/`: All persistence occurs strictly in `.txt` files (`events_latest.txt`, `organizer_events.txt`, `sync_report_*.txt`).
3. Check `GET /health`: Explicitly confirms `"database": "none - text file storage only"`.

---

## Troubleshooting & Common Errors

1. **`INTERNAL_SYNC_SECRET not configured`**:
   - Ensure you copied `.env.example` to `.env` and set `INTERNAL_SYNC_SECRET`.
2. **`Missing x-organizer-id header`**:
   - For dev testing, pass `-Headers @{ "x-organizer-id" = "test-user-id" }`.
3. **No events returned**:
   - Run `npm run fetch:events` to populate `events_latest.txt`.
4. **Port 4000 already in use**:
   - Change `PORT=4001` in `.env`.
