import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 4003 })

const broadcast = (message) => {
  const payload = JSON.stringify(message)
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload)
  })
}

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'system.connected', payload: { message: 'Connected to practice server' } }))

  const interval = setInterval(() => {
    socket.send(JSON.stringify({
      type: 'system.tick',
      payload: { timestamp: new Date().toISOString() },
    }))
  }, 5000)

  socket.on('message', (data) => {
    try {
      const parsed = JSON.parse(String(data))
      broadcast({
        type: parsed.type ?? 'chat.message',
        payload: parsed.payload ?? { text: String(data) },
      })
    } catch {
      socket.send(JSON.stringify({
        type: 'system.error',
        payload: { message: 'Malformed JSON message' },
      }))
    }
  })

  socket.on('close', () => clearInterval(interval))
})

console.log('WebSocket server on ws://localhost:4003')
