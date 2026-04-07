# Heat Creator — Future Improvements

## Shareable draw URLs (live via Firebase/Firestore)

Allow a draw to be shared via a unique URL so anyone can view the **current live state** of the draw — if the organiser edits it after sharing, viewers see the update automatically.

**Approach: Firebase/Firestore**

The draw is stored as a Firestore document using its existing UUID as the doc ID. The app stays a static site on GitHub Pages with no backend. Firebase JS SDK loaded via CDN.

### Prerequisites (one-time setup)
1. Create a Firebase project at console.firebase.google.com
2. Enable Firestore (start in test mode)
3. Register a web app and copy the config object
4. Create `firebase-config.js` in the repo root with the config — add to `.gitignore`

### How it works
- When a draw is saved (or changes are saved), it is also written to Firestore using the draw's existing UUID as the document ID
- A **Share** button appears on saved draws — clicking it copies a URL of the form `heat-creator/#/draw/{id}` to the clipboard
- Opening a share URL fetches the draw from Firestore and displays it in **read-only mode** (no edit controls)
- Edits made and saved by the organiser are immediately reflected for anyone who refreshes the shared link

### Firestore security rules
Allow public reads and writes (acceptable for non-sensitive surf competition data):
```
match /draws/{drawId} {
  allow read: if true;
  allow write: if true;
}
```
