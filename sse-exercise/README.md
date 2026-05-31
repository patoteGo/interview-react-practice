# 📡 SSE Exercises — Frontend Practice

A hands-on exercise to master **Server-Sent Events (SSE)** in React.
Each exercise progressively builds on the previous one.

## Quick Start

```bash
# 1. Install everything
npm run setup

# 2. Start both server and client (in separate terminals)
npm run server    # Terminal 1 → http://localhost:3001
npm run client    # Terminal 2 → http://localhost:5173
```

Then open http://localhost:5173 and start coding!

---

## How This Works

- **`server/`** — A pre-built Express server with 5 SSE endpoints. Don't modify this.
- **`client/src/exercises/`** — 5 React components with **TODO comments**. This is where you code.

Each exercise file has a header block with:
- 🎯 **Goal** — What you're building
- 📖 **Concepts** — What you'll learn
- 🔗 **Endpoint** — The SSE URL and event format
- ✅ **Hints** — Scroll down for implementation clues

---

## Exercises

### Exercise 1: Basic Counter
**File:** `client/src/exercises/Exercise1Counter.tsx`
**Endpoint:** `GET /api/counter`

The simplest SSE connection. Connect to the endpoint and display an incrementing counter.

| Concept | What to learn |
|---------|--------------|
| `new EventSource(url)` | Creating a connection |
| `source.onmessage` | Receiving default events |
| `useEffect` cleanup | Closing the connection on unmount |

**Steps:**
1. Add `useEffect` import from React
2. Create `new EventSource(SSE_URL)` inside useEffect
3. Set `source.onmessage` to parse the data and update `count`
4. Set `source.onopen` / `source.onerror` to toggle `connected`
5. Return `() => source.close()` from useEffect

**✅ Done when:** Counter ticks up every second and shows 🟢 Connected.

---

### Exercise 2: Named Events
**File:** `client/src/exercises/Exercise2NamedEvents.tsx`
**Endpoint:** `GET /api/named-events`

Handle multiple event types from a single connection.

| Concept | What to learn |
|---------|--------------|
| `source.addEventListener("tick", fn)` | Named event listeners |
| `removeEventListener` | Proper cleanup |
| Multiple state slices | Organizing different event data |

**Steps:**
1. Create EventSource in useEffect
2. Add three listeners: `"tick"`, `"status"`, `"alert"`
3. Each listener parses data and updates its state
4. **Important:** Store handlers as named functions so you can `removeEventListener` on cleanup
5. Close the source on unmount

**✅ Done when:** All three panels update independently — tick counts up, statuses appear, alerts show.

---

### Exercise 3: Chat Room
**File:** `client/src/exercises/Exercise3Chat.tsx`
**Endpoint:** `GET /api/chat`

Display a chat message stream with typing indicators and auto-scroll.

| Concept | What to learn |
|---------|--------------|
| Auto-scroll with refs | `scrollIntoView()` pattern |
| Conditional rendering | Show/hide typing indicator |
| Event IDs | Server sends `id:` for resumption |

**Steps:**
1. Create EventSource in useEffect
2. On `"message"` event → append to messages array, clear typing user
3. On `"typing"` event → set typing user
4. Add a separate `useEffect` that watches `messages` and scrolls to bottom
5. Cleanup on unmount

**✅ Done when:** Messages stream in, typing indicator flashes between messages, auto-scrolls to bottom.

---

### Exercise 4: Stock Ticker
**File:** `client/src/exercises/Exercise4Stocks.tsx`
**Endpoint:** `GET /api/stocks`

Handle high-frequency updates (~3/sec) and merge them into state efficiently.

| Concept | What to learn |
|---------|--------------|
| `Record<string, T>` | O(1) state merging |
| Functional updates | `setPrices(prev => ...)` |
| Tabular data rendering | Tables with live data |

**Steps:**
1. Create EventSource in useEffect
2. Listen for `"price"` events
3. Use functional state update to merge: `setPrices(prev => ({ ...prev, [symbol]: data }))`
4. Track connection status
5. Cleanup on unmount

**✅ Done when:** Stock prices flicker in real-time, green/red color coding works.

---

### Exercise 5: Flaky Connection (Bonus)
**File:** `client/src/exercises/Exercise5Flaky.tsx`
**Endpoint:** `GET /api/flaky`

The server randomly drops the connection. Handle reconnection gracefully.

| Concept | What to learn |
|---------|--------------|
| `EventSource.readyState` | CONNECTING (0), OPEN (1), CLOSED (2) |
| Auto-reconnect | EventSource reconnects automatically! |
| `onerror` handling | Detecting connection state |

**Steps:**
1. Create EventSource in useEffect
2. Listen for `"status"` events → append to history
3. On `open` → increment reconnect count, set connected
4. On `error` → check `source.readyState`:
   - `EventSource.CONNECTING` → show "Reconnecting..."
   - `EventSource.CLOSED` → show "Disconnected"
5. The magic: EventSource **automatically reconnects** — you just need to handle the state transitions!

**✅ Done when:** Connection drops happen, status shows reconnecting, events resume after reconnect.

---

## 🧠 SSE Quick Reference

### EventSource API

```typescript
// Create connection
const source = new EventSource("http://example.com/events");

// Default messages (no event: field)
source.onmessage = (event) => {
  const data = JSON.parse(event.data);
};

// Named events (event: "tick")
source.addEventListener("tick", (event) => {
  const data = JSON.parse(event.data);
});

// Connection lifecycle
source.onopen = () => console.log("Connected");
source.onerror = (e) => {
  if (source.readyState === EventSource.CONNECTING) {
    console.log("Reconnecting...");
  } else if (source.readyState === EventSource.CLOSED) {
    console.log("Connection lost");
  }
};

// Cleanup
source.close();
```

### SSE Wire Format

```
event: message
data: {"count": 42}
id: 7

event: alert
data: {"severity": "critical","message": "CPU spike"}
```

### React Pattern (What You'll Write)

```typescript
useEffect(() => {
  const source = new EventSource(url);

  const handler = (e: MessageEvent) => {
    setData(JSON.parse(e.data));
  };

  source.addEventListener("eventname", handler);

  return () => {
    source.removeEventListener("eventname", handler);
    source.close();
  };
}, []);
```

---

## 🏗️ Project Structure

```
sse-exercise/
├── server/                    # Pre-built SSE server (don't modify)
│   ├── package.json
│   └── server.mjs             # 5 endpoints
├── client/                    # Your React app
│   ├── src/
│   │   ├── exercises/
│   │   │   ├── Exercise1Counter.tsx      ← YOU CODE HERE
│   │   │   ├── Exercise2NamedEvents.tsx  ← YOU CODE HERE
│   │   │   ├── Exercise3Chat.tsx         ← YOU CODE HERE
│   │   │   ├── Exercise4Stocks.tsx       ← YOU CODE HERE
│   │   │   └── Exercise5Flaky.tsx        ← YOU CODE HERE
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── package.json               # Root scripts
└── README.md                  # This file
```

---

## 💡 Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error | Server already has CORS enabled. Make sure server is running. |
| Events not arriving | Check browser DevTools → Network tab → look for EventStream type |
| Memory leak | Make sure `source.close()` runs on unmount |
| StrictMode double-mount | React 18+ StrictMode mounts/unmounts twice in dev. Use `/* eslint-disable */` or remove `<StrictMode>` if confusing. |

---

## 🎓 Further Reading

- [MDN: EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [HTML spec: Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [SSE vs WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
