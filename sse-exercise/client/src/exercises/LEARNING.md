# SSE with React — Golden Rules

## 1. Create `EventSource` inside `useEffect`

```tsx
// ❌ Outside — creates a new connection on every render
const source = new EventSource(url);

export function Component() { ... }
```

```tsx
// ✅ Inside useEffect — runs once
useEffect(() => {
  const source = new EventSource(url);
}, []);
```

React components re-render on every state change. Code outside `useEffect` runs on **every render** — that means a new SSE connection every time.

---

## 2. Empty dependency array `[]`

```tsx
// ❌ Reconnects every time messages change
useEffect(() => {
  const source = new EventSource(url);
  source.onmessage = (e) => setMessages(prev => [...prev, e.data]);
}, [messages]); // ← infinite loop
```

```tsx
// ✅ Connect once
useEffect(() => {
  const source = new EventSource(url);
  source.onmessage = (e) => setMessages(prev => [...prev, e.data]);
}, []);
```

Use functional state updates (`prev => ...`) instead of depending on state in the array.

---

## 3. Named events need `addEventListener`

SSE events come in two flavors:

| Type | Example | Caught by |
|---|---|---|
| Default (no `event:` field) | `data: {"count": 1}` | `source.onmessage` |
| Named (`event:` field) | `event: tick\ndata: {"value": 1}` | `source.addEventListener("tick", fn)` |

`onmessage` **never** fires for named events. If the server sends `event: status`, only `addEventListener("status", fn)` catches it.

---

## 4. Same function reference for cleanup

```tsx
// ❌ New anonymous functions — removeEventListener does nothing
source.addEventListener("tick", (e) => setTicks(e.data));
return () => source.removeEventListener("tick", () => {}); // no-op!
```

```tsx
// ✅ Named handlers — add and remove use the same reference
const handleTick = (e: MessageEvent) => setTicks(e.data);
source.addEventListener("tick", handleTick);
return () => source.removeEventListener("tick", handleTick);
```

`removeEventListener` requires the **exact same function object**. A new `() => {}` is always a different reference.

---

## 5. Always clean up with `source.close()`

```tsx
useEffect(() => {
  const source = new EventSource(url);

  // ...listeners...

  return () => {
    source.close(); // ← always!
  };
}, []);
```

Without cleanup, the connection stays open after unmount — memory leak, zombie listeners, state updates on dead components.

---

## Bonus: Separate `useEffect` per responsibility

```tsx
// useEffect 1 — SSE connection (runs once)
useEffect(() => {
  const source = new EventSource(url);
  // ...
  return () => source.close();
}, []);

// useEffect 2 — auto-scroll (runs on every message)
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

Each `useEffect` owns one job with its own dependency array. Merging them causes either infinite loops or missed updates.

---

## Quick Reference: The SSE useEffect Template

```tsx
useEffect(() => {
  const source = new EventSource(url);

  source.onopen = () => setConnected(true);
  source.onerror = () => setConnected(false);

  const handleMessage = (e: MessageEvent) => {
    const data = JSON.parse(e.data);
    setState(prev => /* merge data */);
  };

  source.addEventListener("eventName", handleMessage);

  return () => {
    source.removeEventListener("eventName", handleMessage);
    source.close();
  };
}, []);
```
