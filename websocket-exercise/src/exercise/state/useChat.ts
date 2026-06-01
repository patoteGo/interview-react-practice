// useChat — application layer on top of useWebSocket.
//
// Maps raw server messages to chat state (messages, users, typing).
// Provides actions: join, sendMessage, disconnect, reconnect.
//
// Architecture:
//   useWebSocket = transport (how bytes move)
//   useChat      = application (what bytes mean)
//   Components   = presentation (what state looks like)

import { useCallback, useRef, useState } from "react";
import { useWebSocket } from "../client/useWebSocket";
import type { ConnectionStatus, ServerMessage } from "../protocol/types";

// ── Public types ──────────────────────────────────────────────────────────

export interface DisplayMessage {
	id: string;
	username: string;
	text: string;
	timestamp: string;
	isOwn: boolean;
	isSystem: boolean;
}

export type UseChatReturn = {
	username: string | null;
	hasJoined: boolean;
	messages: DisplayMessage[];
	onlineUsers: string[];
	typingUsers: Set<string>;
	status: ConnectionStatus;
	reconnectAttempt: number;
	join: (name: string) => void;
	sendMessage: (text: string) => void;
	startTyping: () => void;
	disconnect: () => void;
	reconnect: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────

function sysMsg(text: string): DisplayMessage {
	return {
		id: crypto.randomUUID(),
		username: "system",
		text,
		timestamp: new Date().toISOString(),
		isOwn: false,
		isSystem: true,
	};
}

const TYPING_TIMEOUT_MS = 2000;

// ── Hook ──────────────────────────────────────────────────────────────────

export function useChat(): UseChatReturn {
	const [username, setUsername] = useState<string | null>(null);
	const [hasJoined, setHasJoined] = useState(false);
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

	// Per-user typing timeout
	const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map(),
	);

	// Read username from a ref inside closures so we don't need it as a dep
	// that would recreate handleMessage (and thus reconnect the socket).
	const usernameRef = useRef<string | null>(null);
	const setUsernameOuter = useCallback((name: string | null) => {
		usernameRef.current = name;
		setUsername(name);
	}, []);

	// ── Route incoming server messages to state updates ─────────────────────

	const handleMessage = useCallback((msg: ServerMessage) => {
		switch (msg.type) {
			case "system.connected":
			case "system.tick":
				break;

			case "system.error":
				setMessages((p) => [...p, sysMsg(`⚠️ ${msg.payload.message}`)]);
				break;

			case "user.joined":
				setOnlineUsers(msg.payload.users);
				if (msg.payload.isYou) {
					setHasJoined(true);
				} else {
					setMessages((p) => [
						...p,
						sysMsg(`👋 ${msg.payload.username} joined`),
					]);
				}
				break;

			case "user.left":
				setOnlineUsers(msg.payload.users);
				setMessages((p) => [...p, sysMsg(`👋 ${msg.payload.username} left`)]);
				break;

			case "chat.message":
				setMessages((p) => [
					...p,
					{
						id: msg.payload.id,
						username: msg.payload.username,
						text: msg.payload.text,
						timestamp: msg.payload.timestamp,
						isOwn: msg.payload.username === usernameRef.current,
						isSystem: false,
					},
				]);
				break;

			case "user.typing": {
				const typer = msg.payload.username;
				clearTimeout(typingTimers.current.get(typer));

				setTypingUsers((prev) => new Set(prev).add(typer));

				typingTimers.current.set(
					typer,
					setTimeout(() => {
						setTypingUsers((prev) => {
							const next = new Set(prev);
							next.delete(typer);
							return next;
						});
						typingTimers.current.delete(typer);
					}, TYPING_TIMEOUT_MS),
				);
				break;
			}
		}
	}, []);

	// ── Transport ───────────────────────────────────────────────────────────

	const { status, send, disconnect, connect, reconnectAttempt } = useWebSocket({
		onMessage: handleMessage,
		onOpen: () => {
			// Re-join automatically after reconnect
			if (usernameRef.current) {
				send({
					type: "user.join",
					payload: { username: usernameRef.current },
				});
			}
		},
	});

	// ── Actions ─────────────────────────────────────────────────────────────

	const join = useCallback(
		(name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return;
			setUsernameOuter(trimmed);
			send({ type: "user.join", payload: { username: trimmed } });
		},
		[send, setUsernameOuter],
	);

	const sendMessage = useCallback(
		(text: string) => {
			const trimmed = text.trim();
			if (!trimmed) return;
			send({ type: "chat.message", payload: { text: trimmed } });
		},
		[send],
	);

	const startTyping = useCallback(
		() => send({ type: "user.typing", payload: {} }),
		[send],
	);

	return {
		username,
		hasJoined,
		messages,
		onlineUsers,
		typingUsers,
		status,
		reconnectAttempt,
		join,
		sendMessage,
		startTyping,
		disconnect,
		reconnect: connect,
	};
}
