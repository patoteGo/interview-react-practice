// useWebSocket — manages a single WebSocket connection with auto-reconnect.
//
// Lifecycle: connect → open → message* → close → (reconnect)
//
// Key design decisions:
//   - Uses a generation counter so stale event handlers from old sockets
//     (e.g. React StrictMode double-mount) are silently ignored.
//   - Exponential backoff on reconnect: 1s, 2s, 4s... up to 30s, max 20 attempts.
//   - Options (onMessage, onOpen, onClose) are read from a ref so they're
//     always fresh without causing reconnects.

import { useEffect, useRef, useState, useCallback } from "react";
import type { ConnectionStatus, ServerMessage } from "../protocol/types";

const WS_URL = "ws://localhost:4003";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30_000;
const MAX_RECONNECT_ATTEMPTS = 20;

export interface UseWebSocketOptions {
	onMessage: (msg: ServerMessage) => void;
	onOpen?: () => void;
	onClose?: () => void;
	autoReconnect?: boolean;
}

export interface UseWebSocketReturn {
	status: ConnectionStatus;
	send: (data: unknown) => void;
	connect: () => void;
	disconnect: () => void;
	reconnectAttempt: number;
}

export function useWebSocket({
	onMessage,
	onOpen,
	onClose,
	autoReconnect = true,
}: UseWebSocketOptions): UseWebSocketReturn {
	const [status, setStatus] = useState<ConnectionStatus>("idle");
	const [reconnectAttempt, setReconnectAttempt] = useState(0);

	const socketRef = useRef<WebSocket | null>(null);
	const generationRef = useRef(0);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	// Store callbacks in refs so the socket event handlers always see the
	// latest versions without us needing to tear down and rebuild listeners.
	const onMessageRef = useRef(onMessage);
	const onOpenRef = useRef(onOpen);
	const onCloseRef = useRef(onClose);
	onMessageRef.current = onMessage;
	onOpenRef.current = onOpen;
	onCloseRef.current = onClose;

	// ── Tear down the current socket (if any) without triggering reconnect ──
	const teardown = useCallback((intentional: boolean) => {
		const socket = socketRef.current;
		if (!socket) return;

		// Bump generation so any in-flight close handlers from this socket
		// are recognized as stale and don't trigger reconnect.
		if (intentional) generationRef.current++;

		socket.onopen = null;
		socket.onclose = null;
		socket.onmessage = null;
		socket.onerror = null;
		socket.close();
		socketRef.current = null;
	}, []);

	// ── Schedule a reconnect attempt ────────────────────────────────────────
	const scheduleReconnect = useCallback((connectFn: () => void) => {
		clearTimeout(reconnectTimerRef.current);

		setReconnectAttempt((prev) => {
			const next = prev + 1;
			if (next > MAX_RECONNECT_ATTEMPTS) return prev;

			const delay = Math.min(RECONNECT_BASE_MS * 2 ** prev, RECONNECT_MAX_MS);

			reconnectTimerRef.current = setTimeout(() => {
				setStatus("reconnecting");
				connectFn();
			}, delay);

			return next;
		});
	}, []);

	// ── Open a new connection ───────────────────────────────────────────────
	const connect = useCallback(() => {
		const current = socketRef.current;
		if (
			current?.readyState === WebSocket.OPEN ||
			current?.readyState === WebSocket.CONNECTING
		) {
			return;
		}

		// Tear down any stale socket first.
		teardown(false);
		clearTimeout(reconnectTimerRef.current);

		const generation = ++generationRef.current;
		const socket = new WebSocket(WS_URL);
		socketRef.current = socket;
		setStatus("connecting");

		socket.onopen = () => {
			if (generation !== generationRef.current) return;
			setStatus("connected");
			setReconnectAttempt(0);
			onOpenRef.current?.();
		};

		socket.onmessage = (event) => {
			if (generation !== generationRef.current) return;
			try {
				onMessageRef.current(JSON.parse(event.data));
			} catch {
				console.warn("[ws] malformed message:", event.data);
			}
		};

		socket.onclose = () => {
			if (generation !== generationRef.current) return;
			setStatus("disconnected");
			onCloseRef.current?.();
			if (autoReconnect) scheduleReconnect(connect);
		};

		socket.onerror = () => {
			// The browser fires onclose right after onerror, so we handle
			// status updates in onclose.
		};
	}, [autoReconnect, teardown, scheduleReconnect]);

	// ── Intentional disconnect ──────────────────────────────────────────────
	const disconnect = useCallback(() => {
		clearTimeout(reconnectTimerRef.current);
		teardown(true);
		setStatus("idle");
		setReconnectAttempt(0);
	}, [teardown]);

	// ── Send JSON to the server ─────────────────────────────────────────────
	const send = useCallback((data: unknown) => {
		const socket = socketRef.current;
		if (socket?.readyState !== WebSocket.OPEN) {
			console.warn("[ws] not open, dropping message");
			return;
		}
		socket.send(JSON.stringify(data));
	}, []);

	// ── Auto-connect on mount, clean up on unmount ──────────────────────────
	useEffect(() => {
		connect();
		return () => {
			clearTimeout(reconnectTimerRef.current);
			teardown(true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { status, send, connect, disconnect, reconnectAttempt };
}
