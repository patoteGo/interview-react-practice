# WebSocket Implementation Guide

## What is already done for you
- React + Vite + TypeScript scaffold
- sample WebSocket server at `ws://localhost:4003`
- starter folders for protocol, client, components, and state

## Read these in order
1. `INSTRUCTIONS.md`
2. `IMPLEMENTATION-GUIDE.md`
3. `GUIDED-EXAMPLES.md`
4. `PRACTICE-CHECKLIST.md`
5. `MILESTONES.md`

## Your assignment
Build a real-time message board or chat-style UI.

Suggested files to create:
- `src/exercise/protocol/types.ts`
- `src/exercise/client/createSocket.ts`
- `src/exercise/state/useSocketState.ts`
- `src/exercise/components/ConnectionBadge.tsx`
- `src/exercise/components/MessageFeed.tsx`
- `src/exercise/components/Composer.tsx`

## Server behavior already available
- sends `system.connected` on connect
- sends `system.tick` every 5s
- broadcasts any JSON message you send
- returns `system.error` for malformed JSON

## Recommended order
1. Define message types
2. Connect to the socket server
3. Show connection status
4. Render incoming messages
5. Send one message
6. Handle close and retry
