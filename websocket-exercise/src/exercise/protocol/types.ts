// =============================================================================
// 📋 PROTOCOL: Message Type Definitions
// =============================================================================
//
// WHY DEFINE TYPES?
//   WebSocket sends raw strings. Without types, you'll typo property names,
//   forget fields, and spend hours debugging. Types enforce a "contract"
//   between client and server.
//
// PATTERN: Every message has { type, payload }.
//   - type: string that tells you WHAT happened
//   - payload: data specific to that event type
//
// LEARNING NOTE:
//   This is a "discriminated union" — TypeScript uses the `type` field
//   to narrow down what `payload` contains. Very common in event systems.
// =============================================================================

// ── Base shape every message must follow ──────────────────────────────────
export interface BaseMessage {
	type: string;
	payload: unknown;
}

// ── Client → Server messages ──────────────────────────────────────────────

export interface ClientJoinMessage {
	type: "user.join";
	payload: { username: string };
}

export interface ClientChatMessage {
	type: "chat.message";
	payload: { text: string };
}

export interface ClientTypingMessage {
	type: "user.typing";
	payload: Record<string, never>; // empty payload, just the type matters
}

export type ClientMessage =
	| ClientJoinMessage
	| ClientChatMessage
	| ClientTypingMessage;

// ── Server → Client messages ──────────────────────────────────────────────

export interface ServerConnectedMessage {
	type: "system.connected";
	payload: { message: string; timestamp: string };
}

export interface ServerTickMessage {
	type: "system.tick";
	payload: { timestamp: string };
}

export interface ServerErrorMessage {
	type: "system.error";
	payload: { message: string };
}

export interface UserJoinedMessage {
	type: "user.joined";
	payload: { username: string; isYou: boolean; users: string[] };
}

export interface UserLeftMessage {
	type: "user.left";
	payload: { username: string; users: string[] };
}

export interface ChatMessageReceived {
	type: "chat.message";
	payload: {
		id: string;
		username: string;
		text: string;
		timestamp: string;
	};
}

export interface UserTypingMessage {
	type: "user.typing";
	payload: { username: string };
}

export type ServerMessage =
	| ServerConnectedMessage
	| ServerTickMessage
	| ServerErrorMessage
	| UserJoinedMessage
	| UserLeftMessage
	| ChatMessageReceived
	| UserTypingMessage;

// ── Connection states (not messages, but lifecycle states) ────────────────
// WebSocket.readyState values:
//   0 = CONNECTING
//   1 = OPEN
//   2 = CLOSING
//   3 = CLOSED
//
// We track a friendlier version in React state.

export type ConnectionStatus =
	| "idle" // haven't connected yet
	| "connecting" // socket is being created
	| "connected" // socket is open, receiving messages
	| "disconnected" // socket closed (maybe intentionally, maybe not)
	| "reconnecting"; // we're trying again after a disconnect
