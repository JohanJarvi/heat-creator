# Heat Creator

A browser-based surf competition heat draw generator. No account, no backend — everything is saved locally in your browser.

---

## Getting started

### Creating a draw

1. Tap **+ New Draw** on the home screen
2. Type a surfer's name and press **Enter** (or tap **Add**) — repeat for each surfer
3. Remove a name by tapping the **×** on their pill
4. Once you have at least 2 surfers, tap **Generate Heats**

Heats are generated randomly using a Fisher-Yates shuffle. Heat sizes are kept between 2 and 6 surfers, preferring groups of 4. Each surfer in a heat is assigned a vest colour (White, Yellow, Red, Blue, Black, Orange).

If you're not happy with the draw, tap **Regenerate** to reshuffle before saving.

---

## The draw view

Once a draw is generated (or you open a saved draw), you land on the draw view screen.

### Scheduling

Set a start time and durations at the top of the screen to calculate when each heat begins:

- **Start time** — when Heat 1 begins (e.g. 7:00 AM)
- **Heat duration** — how long each heat runs in minutes (e.g. 25)
- **Hold between heats** — the gap between heats in minutes (e.g. 5)

All three fields are optional. When filled in, each heat card displays its start time. Times update live as you change the values.

### Moving a surfer to a different heat

Each surfer chip has a **Move…** dropdown. Select any other heat to move them there instantly. Vest colours and numbers are reassigned automatically in both heats after the move.

Selecting **+ New heat** from the dropdown creates a new heat and moves the surfer into it in one step.

### Adding a surfer to a heat

Each heat card has an **Add surfer…** input at the bottom. Type a name and press **Enter** or tap **Add**. The surfer is added to that heat with the next available vest colour. A heat cannot exceed 6 surfers.

### Removing a surfer from a heat

Tap the **×** button on any surfer chip to remove them from their heat. Remaining vest numbers are reassigned so there are no gaps.

### Adding a new heat

Tap **+ Add Heat** in the top bar to append a blank heat to the draw. Surfers can then be added to it or moved into it.

### Deleting a heat

Tap the **×** in the top-right corner of any heat card to remove that heat entirely. Remaining heats are renumbered automatically.

---

## Saving and managing draws

- Tap **Save Draw** (new draws only) to store the draw locally in your browser
- Tap **Save Changes** (appears after editing a saved draw) to overwrite the stored draw with your changes
- Tap **Delete** to permanently remove a draw
- All saved draws are listed on the home screen, newest first, showing the date, surfer count, and number of heats

Draws are stored in your browser's localStorage and persist across page refreshes. They are not shared across devices or browsers.

---

## Running locally

The app uses ES modules and must be served over HTTP — opening `index.html` directly as a `file://` URL will not work.

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

To run the algorithm unit tests:

```sh
npm test
```
