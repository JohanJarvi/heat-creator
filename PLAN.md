# Heat Creator — Future Improvements

## Shareable draw URLs

Allow a draw to be shared via a unique URL so anyone can view it without needing the creator's browser/localStorage.

**Approaches (in order of complexity):**

1. **URL hash encoding (no backend)** — compress + base64 the draw JSON into the URL fragment (e.g. `heat-creator/#eyJoZWF0cy...`). Works on GitHub Pages as-is, but URLs get long with many surfers and there's no short unique ID.

2. **Firebase/Firestore (recommended)** — generate a short unique ID, store the draw in Firestore, load it at `heat-creator/{id}`. The app stays as a static site on GitHub Pages, just adds the Firebase SDK for reads/writes. Free tier is generous for low traffic.

3. **Own backend** — a small server (Node/Deno) with a database (SQLite/Postgres) for full control. Requires hosting (Fly.io, Railway, etc.) and is a larger overhaul.

This enhancement may require migrating away from localStorage as the sole persistence layer depending on the approach chosen.
