# Inbound SPX Panel

Real-time monitoring panel for ES2 inbound operations — vehicle queue, dock occupancy, unloading and status, synced with Supabase.

## Features

- Vehicle queue with status (Queued, Assigned, Docked, Finished)
- Real-time occupancy of internal and external docks
- Filters by status and by modality (FM / LH)
- Search by queue number, plate, driver or LT
- Inbound Summary modal with shift metrics (queue time, unloading time and dwell time per modality) and an option to generate a summary image
- Light/dark theme
- Automatic refresh (polling + Supabase realtime)

## What changed in this version

- Reorganized the code: it used to be a single large file, now it's split by responsibility (data hooks, screen components and utility functions), much easier to touch without breaking something
- The main panel now automatically falls back to the most recent operational day with data when there's nothing for today yet, showing a banner on screen with the date being displayed
- Supabase credentials removed from the source code and moved to environment variables
- Removed an unnecessary automatic write to the database (dwell time calculation is now in-memory only, for display)

## Running locally

```
npm install
npm run dev
```

Create a `.env.local` file at the root with the variables (see `.env.example`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

## Production build

```
npm run build
```

Outputs static files to `dist/`.
