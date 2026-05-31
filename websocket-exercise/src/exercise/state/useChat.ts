// =============================================================================
// 💬 useChat — Chat state management hook
// =============================================================================
//
// WHAT THIS DOES:
//   - Combines useWebSocket (transport) with chat-specific state
//   - Manages: messages list, online users, current user, typing indicators
//   - Provides actions: join, sendMessage, startTyping
//   - Handles ALL server message types and updates state accordingly
//
// ARCHITECTURE NOTE:
//   This hook is the "brain" of the chat app.
//   - useWebSocket handles the connection (transport layer)
//   - useChat handles the meaning of messages (application layer)
//   - Components just render whatever state this hook provides
//
//   Separating transport from application logic is important.
//   If you switched from WebSocket to SSE or polling, only useWebSocket
//   would change. useChat stays the same.
// =============================================================================

import { useCallback, useRef, useState } from "react";
import { useWebSocket } from "../client/useWebSocket";
import type {
	ConnectionStatus,
	ServerMessage,
	ChatMessageReceived,
} from "../protocol/types";

// ── Types for our chat state ──────────────────────────────────────────────

export interface DisplayMessage {
	id: string;
	username: string;
	text: string;
	timestamp: string;
	/** Is this from the current user? */
	isOwn: boolean;
	/** Is this a system notification (join/leave)? */
	isSystem: boolean;
}

interface ChatState {
	username: string | null;
	hasJoined: boolean;
	messages: DisplayMessage[];
	onlineUsers: string[];
	typingUsers: Set<string>;
	status: ConnectionStatus;
	reconnectAttempt: number;
}

interface ChatActions {
	join: (username: string) => void;
	sendMessage: (text: string) => void;
	disconnect: () => void;
	reconnect: () => void;
}

export type UseChatReturn = ChatState & ChatActions;

// ── Helper: create a system message (join/leave notifications) ────────────
function systemMessage(text: string): DisplayMessage {
	return {
		id: crypto.randomUUID(),
		username: "system",
		text,
		timestamp: new Date().toISOString(),
		isOwn: false,
		isSystem: true,
	};
}

export function useChat(): UseChatReturn {
	// ── Chat state ──────────────────────────────────────────────────────────
	const [username, setUsername] = useState<string | null>(null);
	const [hasJoined, setHasJoined] = useState(false);
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

	// Ref for typing timeout (so we can clear it)
	const typingTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map(),
	);

	// ── Process incoming server messages ────────────────────────────────────
	// This is the heart of the hook: map server events → UI state updates.
	const handleMessage = useCallback(
		(msg: ServerMessage) => {
			switch (msg.type) {
				// ── Server says we're connected (WebSocket open) ──────────────────
				case "system.connected":
					// Don't add to chat — this is a transport event, not a chat event
					break;

				// ── Heartbeat tick ────────────────────────────────────────────────
				case "system.tick":
					// Silent — we don't show these in the UI
					break;

				// ── Error from server ────────────────────────────────────────────
				case "system.error":
					setMessages((prev) => [
						...prev,
						systemMessage(`⚠️ ${msg.payload.message}`),
					]);
					break;

				// ── Someone joined (maybe us!) ───────────────────────────────────
				case "user.joined": {
					setOnlineUsers(msg.payload.users);
					if (msg.payload.isYou) {
						// We joined — don't show "you joined" to ourselves
						setHasJoined(true);
					} else {
						setMessages((prev) => [
							...prev,
							systemMessage(`👋 ${msg.payload.username} joined the chat`),
						]);
					}
					break;
				}

				// ── Someone left ─────────────────────────────────────────────────
				case "user.left": {
					setOnlineUsers(msg.payload.users);
					setMessages((prev) => [
						...prev,
						systemMessage(`👋 ${msg.payload.username} left the chat`),
					]);
					break;
				}

				// ── Chat message! The fun part ───────────────────────────────────
				case "chat.message": {
					const chat = msg as ChatMessageReceived;
					setMessages((prev) => [
						...prev,
						{
							id: chat.payload.id,
							username: chat.payload.username,
							text: chat.payload.text,
							timestamp: chat.payload.timestamp,
							isOwn: chat.payload.username === username,
							isSystem: false,
						},
					]);
					break;
				}

				// ── Someone is typing ────────────────────────────────────────────
				case "user.typing": {
					const typer = msg.payload.username;
					// Clear existing timeout for this user
					const existing = typingTimeoutRef.current.get(typer);
					if (existing) clearTimeout(existing);

					// Add to typing set
					setTypingUsers((prev) => {
						const next = new Set(prev);
						next.add(typer);
						return next;
					});

					// Remove after 2s of no typing updates
					const timeout = setTimeout(() => {
						setTypingUsers((prev) => {
							const next = new Set(prev);
							next.delete(typer);
							return next;
						});
						typingTimeoutRef.current.delete(typer);
					}, 2000);
					typingTimeoutRef.current.set(typer, timeout);
					break;
				}
			}
		},
		[username],
	);

	// ── Connect to WebSocket server ─────────────────────────────────────────
	const { status, send, disconnect, connect, reconnectAttempt } = useWebSocket({
		onMessage: handleMessage,
		onOpen: () => {
			// If we have a username, re-join automatically after reconnect
			if (username) {
				send({ type: "user.join", payload: { username } });
			}
		},
	});

	// ── Actions ─────────────────────────────────────────────────────────────

	const join = useCallback(
		(name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return;
			setUsername(trimmed);
			send({ type: "user.join", payload: { username: trimmed } });
		},
		[send],
	);

	const sendMessage = useCallback(
		(text: string) => {
			const trimmed = text.trim();
			if (!trimmed) return;
			send({ type: "chat.message", payload: { text: trimmed } });
		},
		[send],
	);

	// Typing indicator — fire-and-forget
	const _startTyping = useCallback(() => {
		send({ type: "user.typing", payload: {} });
	}, [send]);

	return {
		// State
		username,
		hasJoined,
		messages,
		onlineUsers,
		typingUsers,
		status,
		reconnectAttempt,
		// Actions
		join,
		sendMessage,
		disconnect,
		reconnect: connect,
	};
}
