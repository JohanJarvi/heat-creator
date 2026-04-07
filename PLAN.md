# Heat Creator — Surf Heat Draw Generator

## Context
A plain HTML/CSS/JS web app for generating surfing competition heat draws. Draws are persisted in the browser's **localStorage** so they survive page refreshes and can be revisited or deleted at any time — no backend required. Hosted for free on GitHub Pages.

---

## Files

```
heat-creator/
├── index.html          ← main app shell + UI
├── heat-algorithm.js   ← pure algorithm functions (importable for tests)
├── heat-algorithm.test.js
└── package.json        ← vitest dev dependency only
```

`index.html` loads `heat-algorithm.js` as an ES module (`<script type="module">`). No build step required to run the app.

---

## App Flow & Screens

### Screen 1 — Saved Draws (Home)
Shown on first load (and after saving/deleting a draw).

- Lists all draws stored in localStorage, newest first
- Each entry shows: draw name/date, surfer count, number of heats + a **Delete** button
- **"+ New Draw"** button navigates to the Name Entry screen

### Screen 2 — Name Entry
- Autofocused text input; pressing **Enter** adds the name as a pill
- Pills show name + **×** remove button
- **"Generate Heats"** button appears once ≥ 2 names entered (minimum heat size is 2)
- **"← Back"** returns to home without saving

### Screen 3 — Heat Draw (View)
Reached by generating a new draw OR clicking a saved draw on the home screen.

- **Save** button (only shown for new, unsaved draws) — assigns a UUID, stores in localStorage, navigates to home
- **Delete** button — removes from localStorage, navigates to home
- **Regenerate** button (only for new, unsaved draws) — reshuffles randomly
- Heat cards labeled "Heat 1", "Heat 2", etc.
- Each surfer shown as a colored chip with vest color + number

---

## localStorage Schema

Key: `heat-creator-draws`
Value: JSON array of draw objects:
```json
[
  {
    "id": "uuid-v4",
    "createdAt": "ISO-8601 timestamp",
    "surfers": ["Alice", "Bob", ...],
    "heats": [
      { "heatNumber": 1, "surfers": [{ "name": "Alice", "vestNumber": 1 }, ...] },
      ...
    ]
  }
]
```

---

## Heat Size Algorithm

Colors (vest numbers 1–6):
1. White `#FFFFFF` (dark border + dark text)
2. Yellow `#FFD700`
3. Red `#E53E3E`
4. Blue `#3182CE`
5. Black `#1A202C` (white text)
6. Orange `#ED8936`

Heat size range: **min 2, preferred 4, max 6**. Always produce at least 2 heats.

```js
function getHeatCount(N) {
  for (const target of [4, 5, 6]) {
    const n = Math.max(2, Math.round(N / target));
    const avg = N / n;
    if (avg >= 2 && avg <= 6 && n * 20 <= 240) return n;
  }
  return Math.max(1, Math.ceil(N / 6)); // hard cap fallback
}
```

Distribute N surfers across n_heats (mix sizes to avoid tiny heats):
```js
const small = Math.floor(N / n_heats);
const nLarge = N - n_heats * small;
// → nLarge heats of (small+1), remaining heats of small
```

Examples:
- 4 surfers → 2 heats of 2 ✓
- 9 surfers → 2 heats (4+5) ✓
- 48 surfers → 12 heats of 4 (240 min exactly) ✓
- 52 surfers → size 4 → 13 heats → 260 min ✗ → size 5 → 10 heats → 200 min ✓

Shuffle with Fisher-Yates, then slice into heats. Assign vest colors 1–N sequentially within each heat.

---

## Testing — Vitest Unit Tests

`heat-algorithm.js` exports pure functions only. `heat-algorithm.test.js` covers:

- `getHeatCount`: 4→2, 9→2, 48→12, 52→10, large counts forcing size 6
- `buildHeats`: total surfer count preserved, vest numbers 1–N per heat, heat sizes within 2–6
- Fisher-Yates shuffle: output is a permutation of input

Run with: `npm test`

---

## Git & Hosting

**Git setup:**
```sh
git init
git add .
git commit -m "Initial commit"
```

**GitHub Pages (free hosting):**
1. Create a public GitHub repo (e.g. `heat-creator`)
2. Push `main` branch
3. Settings → Pages → Source: `main` branch, `/ (root)`
4. Live at `https://<username>.github.io/heat-creator/`

Every `git push` to `main` redeploys automatically. No CI config needed.

---

## Verification
1. `npm test` — all algorithm tests pass
2. Open `index.html` in browser (file:// or GitHub Pages URL)
3. Add names → Generate → verify heat count and colors are correct
4. Save the draw → verify it appears on the home screen after redirect
5. Reload the page → verify saved draw is still listed (localStorage persisted)
6. Delete the draw → verify it disappears from the list
7. Test with 4 names to confirm minimum 2 heats of 2

---

## Future Improvements

### 1. Move surfers between heats

After a draw is generated or loaded from a saved draw, allow surfers to be moved from one heat to another. This covers the common scenario where someone needs to leave early and must be slotted into an earlier heat.

- Provide a way on the draw view screen to move a surfer from their current heat into a different heat
- Vest colours/numbers should be reassigned automatically after the move so they stay sequential within each heat
- Moving a surfer into a heat that already has 6 surfers (the max) should be prevented or warned against
- The updated draw should be saveable

### 2. Add and remove surfers from an existing draw

Allow surfers to be added to or removed from a draw without regenerating the entire draw. This keeps the existing heat assignments stable for everyone else.

- Provide a way to add a new surfer to a specific heat
- Provide a way to remove a surfer from a heat
- Adding a surfer should auto-assign them the next available vest colour in that heat
- Removing a surfer should re-number the remaining vests so there are no gaps
- If adding a surfer would exceed the max heat size (6), either warn or offer to place them in a different heat
- The heat count should remain unchanged — new surfers slot into existing heats rather than creating new ones
- The updated draw should be saveable

### 3. Heat scheduling (start time, duration, hold)

When creating a draw, allow the user to specify:

- **Start time** — when the first heat begins (e.g. 7:00 AM)
- **Heat duration** — how long each heat runs (e.g. 25 minutes)
- **Hold duration** — gap between heats (e.g. 5 minutes)

Each heat card on the draw view screen should then display its calculated start time. For example with a 7:00 AM start, 25 min heats, and 5 min holds:

| Heat | Start time |
|------|------------|
| Heat 1 | 7:00 AM |
| Heat 2 | 7:30 AM |
| Heat 3 | 8:00 AM |
| Heat 4 | 8:30 AM |

- These fields should be optional — if not provided, heats display without times (current behaviour)
- The schedule settings should be saved alongside the draw in localStorage
- Changing heat duration or hold after generation should recalculate all start times

### 4. Shareable draw URLs

Allow a draw to be shared via a unique URL so anyone can view it without needing the creator's browser/localStorage.

**Approaches (in order of complexity):**

1. **URL hash encoding (no backend)** — compress + base64 the draw JSON into the URL fragment (e.g. `heat-creator/#eyJoZWF0cy...`). Works on GitHub Pages as-is, but URLs get long with many surfers and there's no short unique ID.

2. **Firebase/Firestore (recommended)** — generate a short unique ID, store the draw in Firestore, load it at `heat-creator/{id}`. The app stays as a static site on GitHub Pages, just adds the Firebase SDK for reads/writes. Free tier is generous for low traffic.

3. **Own backend** — a small server (Node/Deno) with a database (SQLite/Postgres) for full control. Requires hosting (Fly.io, Railway, etc.) and is a larger overhaul.

This enhancement may require migrating away from localStorage as the sole persistence layer depending on the approach chosen.
