export const VEST_COLORS = [
  { number: 1, name: 'White',  bg: '#FFFFFF', text: '#1A202C', border: '#CBD5E0' },
  { number: 2, name: 'Yellow', bg: '#FFD700', text: '#1A202C', border: '#FFD700' },
  { number: 3, name: 'Red',    bg: '#E53E3E', text: '#FFFFFF', border: '#E53E3E' },
  { number: 4, name: 'Blue',   bg: '#3182CE', text: '#FFFFFF', border: '#3182CE' },
  { number: 5, name: 'Black',  bg: '#1A202C', text: '#FFFFFF', border: '#1A202C' },
  { number: 6, name: 'Orange', bg: '#ED8936', text: '#FFFFFF', border: '#ED8936' },
];

// Fisher-Yates shuffle — returns a new shuffled array
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns the number of heats for N surfers.
// Prefers heat size ~4, scales up to 6 to stay under 4 hours (12 heats × 20 min).
// Always produces at least 2 heats. Min heat size 2, max 6.
export function getHeatCount(N) {
  for (const target of [4, 5, 6]) {
    const n = Math.max(2, Math.round(N / target));
    const avg = N / n;
    if (avg >= 2 && avg <= 6 && n * 20 <= 240) return n;
  }
  return Math.max(1, Math.ceil(N / 6));
}

// Builds heats from a list of surfer names.
// Returns an array of heats, each with { heatNumber, surfers: [{ name, vestNumber, color }] }
export function buildHeats(surfers) {
  const shuffled = shuffle(surfers);
  const N = shuffled.length;
  const nHeats = getHeatCount(N);
  const small = Math.floor(N / nHeats);
  const nLarge = N - nHeats * small; // heats that get one extra surfer

  const heats = [];
  let idx = 0;
  for (let h = 0; h < nHeats; h++) {
    const size = h < nLarge ? small + 1 : small;
    const heatSurfers = shuffled.slice(idx, idx + size).map((name, i) => ({
      name,
      vestNumber: i + 1,
      color: VEST_COLORS[i],
    }));
    heats.push({ heatNumber: h + 1, surfers: heatSurfers });
    idx += size;
  }
  return heats;
}
