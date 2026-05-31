# 🚀 WebSocket Chat — Guided Walkthrough

## Quick Start (5 seconds)

```bash
# Terminal 1: Start the WebSocket server
npm run server

# Terminal 2: Start the React frontend
npm run dev
```

Then open **http://localhost:5173** in **two browser tabs** (or two different browsers). Pick different names. Chat!

---

## What You'll Learn

| Concept | Where in the code |
|---------|------------------|
| WebSocket server setup | `server/index.mjs` |
| Message protocol design | `src/exercise/protocol/types.ts` |
| Connection lifecycle (open/message/close) | `src/exercise/client/useWebSocket.ts` |
| Auto-reconnect with backoff | `src/exercise/client/useWebSocket.ts` |
| Chat state management | `src/exercise/state/useChat.ts` |
| Server→Client event handling | `useChat.ts` → `handleMessage` switch |
| Auto-scroll in message feeds | `src/exercise/components/MessageFeed.tsx` |
| Typing indicators with debounce | `src/exercise/components/Composer.tsx` |

---

## File Map

```
websocket-exercise/
├── server/
│   └── index.mjs              ← WebSocket server (Node.js + ws)
├── src/
│   ├── App.tsx                ← Main app: wires hooks + components
│   ├── main.tsx               ← React entry point
│   ├── styles.css             ← All styles
│   └── exercise/
│       ├── protocol/
│       │   └── types.ts       ← Message type definitions (the "contract")
│       ├── client/
│       │   └── useWebSocket.ts ← Transport layer hook
│       ├── state/
│       │   └── useChat.ts     ← Application logic hook
│       └── components/
│           ├── ConnectionBadge.tsx  ← Status indicator
│           ├── MessageFeed.tsx      ← Scrollable message list
│           ├── Composer.tsx         ← Input + send button
│           ├── UserList.tsx         ← Online users sidebar
│           └── UsernamePrompt.tsx   ← Name entry screen
├── GUIDED-WALKTHROUGH.md     ← You are here
├── INSTRUCTIONS.md            ← High-level concepts
└── IMPLEMENTATION-GUIDE.md    ← Build order
```

---

## How It Works: Step by Step

### 1. Connection Opens

```
Browser                           Server
   │                                │
   │──── new WebSocket(url) ───────▶│  (HTTP upgrade handshake)
   │                                │
   │◀── system.connected ──────────│  (server welcomes you)
   │                                │
```

**Code:** `useWebSocket.ts` → `connect()` creates `new WebSocket(WS_URL)`  
**UI:** Badge turns green → "Connected"

### 2. User Joins

```
Browser                           Server
   │                                │
   │──── user.join { username } ──▶│  (client sends name)
   │                                │
   │◀── user.joined { isYou:true } │  (server confirms)
   │◀── user.joined { isYou:false} │  (broadcast to others)
   │                                │
```

**Code:** `useChat.ts` → `join()` → `send({ type: 'user.join', ... })`  
**UI:** Username prompt disappears, chat appears

### 3. Chat Messages

```
Browser A                         Server                         Browser B
   │                                │                                │
   │── chat.message { text } ─────▶│                                │
   │                                │── chat.message ───────────────▶│
   │◀── chat.message { id, ... } ──│                                │
   │                                │                                │
```

**Key insight:** The server broadcasts to ALL clients (including sender).  
The sender uses the broadcast as confirmation that the server received it.

**Code:** `Composer.tsx` → `onSend` → `useChat.sendMessage` → `send()` → server broadcasts → `handleMessage` → `setMessages`

### 4. Connection Drops

```
Browser                           Server
   │                                │
   │          (server dies)          X
   │                                │
   │──── close event ────────────   │
   │                                │
   │  wait 1s                       │
   │──── new WebSocket() ────────▶  │  (server is still down)
   │──── close event ────────────   │
   │                                │
   │  wait 2s                       │
   │──── new WebSocket() ──────────▶│  (server is back!)
   │◀── system.connected ──────────│
   │──── user.join (auto) ────────▶│  (rejoin with saved username)
   │                                │
```

**Code:** `useWebSocket.ts` → `close` handler → exponential backoff → `connect()` again  
**UI:** Badge turns red → orange → green

---

## Experiments to Try

### 🔬 Beginner

1. **Two tabs, one chat** — Open 2 tabs, join with different names, send messages
2. **Kill the server** — `Ctrl+C` the server, watch the badge change
3. **Restart the server** — Watch auto-reconnect kick in
4. **Send invalid JSON** — Open browser console: `document.querySelector('input').value = '{bad json'`

### 🔧 Intermediate

5. **Add a new message type** — e.g., `chat.emoji` that renders emoji bigger
6. **Message persistence** — Store messages in `localStorage`, restore on reload
7. **Timestamp formatting** — Show "2 min ago" instead of raw time
8. **Unread count** — Track unread messages when tab is not focused

### 🚀 Advanced

9. **Rooms** — Add `room.join`/`room.leave` messages, broadcast only within rooms
10. **Message editing** — Add `chat.edit` with message ID, update in place
11. **File upload** — Send small images as base64 through WebSocket
12. **Rate limiting** — Client-side throttle: max 5 messages per 10 seconds

---

## Architecture Patterns

### Separation of Concerns

```
Transport Layer (useWebSocket)  →  HOW to send/receive
  ├── Connection lifecycle
  ├── Reconnect logic
  └── Raw send/receive

Application Layer (useChat)     →  WHAT messages mean
  ├── Message routing (switch on type)
  ├── State management
  └── Business logic

Presentation Layer (Components) →  HOW it looks
  ├── Rendering state
  ├── User interactions
  └── Animations
```

### Server-Authoritative State

The server owns the truth:
- User list → server sends the full list on every join/leave
- Message IDs → server generates them (with `crypto.randomUUID()`)
- Message ordering → server broadcasts in order received

The client never optimistically adds users or assumes ordering.

### Event-Driven State Updates

Every incoming message triggers a state update through a single `handleMessage` function with a `switch` statement. This makes the data flow easy to trace:

```
Server message → handleMessage → switch(type) → setState → re-render
```

---

## Common WebSocket Gotchas

| Problem | Solution |
|---------|----------|
| Socket closes on component re-render | Store socket in `useRef`, not `useState` |
| Stale closures in event handlers | Store callbacks in `useRef` and read from ref |
| Memory leak from unmounted component | Close socket in `useEffect` cleanup |
| Multiple reconnects firing | Track intentional vs unintentional close |
| Messages arrive out of order | Add server-generated IDs, sort by timestamp |
| Server sends malformed data | Always `try/catch` around `JSON.parse` |

---

## Debugging Tips

1. **Browser DevTools → Network → WS tab** — See every message sent/received
2. **Console logs** — Search for `[WebSocket]` in the hook code
3. **React DevTools** — Inspect hook state (status, messages, etc.)
4. **Server logs** — Add `console.log` in `server/index.mjs` message handler
