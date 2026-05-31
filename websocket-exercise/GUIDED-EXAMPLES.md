# WebSocket Guided Examples

## Protocol type shape
```ts
export type SocketMessage = {
  type: string
  payload: unknown
}
```

## Client setup shape
```ts
export function createSocket(onMessage: (message: unknown) => void) {
  const socket = new WebSocket('ws://localhost:4003')

  socket.addEventListener('message', (event) => {
    onMessage(JSON.parse(event.data))
  })

  return socket
}
```

## React effect shape
```tsx
useEffect(() => {
  const socket = createSocket((message) => {
    // update state
  })

  return () => socket.close()
}, [])
```

## First UI goals
- connected/disconnected badge
- list of incoming events
- input + send button
