# Collab Whiteboard

A real-time collaborative whiteboard — multiple people can draw on the same canvas together, live, from different devices. Built with Node.js, Express, and Socket.io.

## Features
- Real-time drawing sync across all connected users
- Room-based sessions (share a link, everyone in that room sees the same board)
- Live user count
- Live remote cursors (see where others are pointing)
- Pen + eraser tools, adjustable color and stroke size
- Clear board (syncs for everyone)
- Works on desktop and touch devices

## Run locally

```bash
npm install
node server.js
```

Then open http://localhost:3000 in your browser.

To test the "collaborative" part: open the same URL in a second browser tab/window (or on your phone using your computer's local IP). Draw in one — it appears instantly in the other.

## Share a specific room

Add `?room=yourroomname` to the URL, e.g.:
`http://localhost:3000/?room=team-alpha`

Anyone with that link joins the same board.

## Tech stack
- **Backend:** Node.js, Express, Socket.io (WebSockets)
- **Frontend:** Vanilla JS, HTML5 Canvas API
- **State:** In-memory per-room drawing history (server restart clears boards — swap in Redis/DB for persistence)

## Possible next steps
- Persist drawing history to a database (MongoDB/Redis) so boards survive restarts
- Add shape tools (rectangle, circle, line) and text
- Add undo/redo
- Add authentication so only invited users can join a room
- Deploy to Render/Railway (free tier) so it's live at a public URL for your LinkedIn demo
