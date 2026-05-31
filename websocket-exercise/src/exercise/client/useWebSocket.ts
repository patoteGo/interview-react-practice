// =============================================================================
// 🔌 useWebSocket — React hook for WebSocket lifecycle
// =============================================================================
//
// WHAT THIS DOES:
//   1. Creates a WebSocket connection
//   2. Tracks connection status (connecting → connected → disconnected)
//   3. Calls your `onMessage` callback for every incoming message
//   4. Provides a `send` function to emit messages to the server
//   5. Auto-reconnects with exponential backoff when connection drops
//   6. Cleans up (closes socket) when the component unmounts
//
// WHY A HOOK?
//   React components re-render often. You don't want to create a new
//   WebSocket every render. useEffect + useRef keeps ONE socket alive
//   across renders.
//
// KEY CONCEPTS:
//   - useEffect: setup on mount, cleanup on unmount
//   - useRef: holds mutable data (the socket) without causing re-renders
//   - useCallback: memoizes functions so child components don't re-render
//   - Exponential backoff: wait 1s, 2s, 4s, 8s... before retrying
//
// 📖 READ THE CODE LINE BY LINE. Every section has comments.
// =============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import type { ConnectionStatus, ServerMessage } from "../protocol/types";

// ── Configuration ─────────────────────────────────────────────────────────
const WS_URL = "ws://localhost:4003";
const RECONNECT_BASE_MS = 1000; // start at 1s
const RECONNECT_MAX_MS = 30000; // cap at 30s
const MAX_RECONNECT_ATTEMPTS = 20;

interface UseWebSocketOptions {
	/** Called for every parsed server message */
	onMessage: (msg: ServerMessage) => void;
	/** Called when connection is established */
	onOpen?: () => void;
	/** Called when connection drops */
	onClose?: () => void;
	/** Auto-reconnect on disconnect? default: true */
	autoReconnect?: boolean;
}

interface UseWebSocketReturn {
	/** Current connection status */
	status: ConnectionStatus;
	/** Send a JSON message to the server */
	send: (data: unknown) => void;
	/** Manually open the connection */
	connect: () => void;
	/** Manually close the connection */
	disconnect: () => void;
	/** How many reconnect attempts have been made */
	reconnectAttempt: number;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
	const { onMessage, onOpen, onClose, autoReconnect = true } = options;

	// ── State that triggers re-renders ──────────────────────────────────────
	const [status, setStatus] = useState<ConnectionStatus>("idle");
	const [reconnectAttempt, setReconnectAttempt] = useState(0);

	// ── Refs: mutable values that survive re-renders ────────────────────────
	// We store the socket and options in refs so the event handlers always
	// see the latest values without being recreated.
	const socketRef = useRef<WebSocket | null>(null);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const intentionalCloseRef = useRef(false); // did WE close it?

	// ── Cleanup helper ──────────────────────────────────────────────────────
	const clearReconnect = useCallback(() => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}
	}, []);

	// ── Connect function ────────────────────────────────────────────────────
	// This is the core: creates the WebSocket, attaches event handlers.
	const connect = useCallback(() => {
		// Don't create a new socket if one is already open/connecting
		if (
			socketRef.current?.readyState === WebSocket.OPEN ||
			socketRef.current?.readyState === WebSocket.CONNECTING
		) {
			return;
		}

		clearReconnect();
		intentionalCloseRef.current = false;
		setStatus("connecting");

		// ── STEP 1: Create the WebSocket ────────────────────────────────────
		const socket = new WebSocket(WS_URL);
		socketRef.current = socket;

		// ── STEP 2: Handle open ─────────────────────────────────────────────
		socket.addEventListener("open", () => {
			setStatus("connected");
			setReconnectAttempt(0); // reset on successful connect
			optionsRef.current.onOpen?.();
		});

		// ── STEP 3: Handle incoming messages ────────────────────────────────
		// This is where server data flows into your React state.
		socket.addEventListener("message", (event: MessageEvent) => {
			try {
				// WebSocket data is always a string. Parse it.
				const parsed = JSON.parse(event.data) as ServerMessage;
				optionsRef.current.onMessage(parsed);
			} catch {
				// Guard: skip malformed messages
				console.warn("[WebSocket] Failed to parse message:", event.data);
			}
		});

		// ── STEP 4: Handle close ────────────────────────────────────────────
		socket.addEventListener("close", () => {
			setStatus("disconnected");
			optionsRef.current.onClose?.();

			// ── Auto-reconnect with exponential backoff ───────────────────────
			if (autoReconnect && !intentionalCloseRef.current) {
				setReconnectAttempt((prev) => {
					const next = prev + 1;
					if (next > MAX_RECONNECT_ATTEMPTS) return prev;

					// Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s, 30s...
					const delay = Math.min(
						RECONNECT_BASE_MS * 2 ** prev,
						RECONNECT_MAX_MS,
					);

					reconnectTimeoutRef.current = setTimeout(() => {
						setStatus("reconnecting");
						connect(); // recursive reconnect!
					}, delay);

					return next;
				});
			}
		});

		// ── STEP 5: Handle errors ───────────────────────────────────────────
		socket.addEventListener("error", (event) => {
			console.error("[WebSocket] error:", event);
			// Note: WebSocket fires "close" right after "error", so we don't
			// need to set status here — the close handler does it.
		});
	}, [autoReconnect, clearReconnect]);

	// ── Disconnect function ─────────────────────────────────────────────────
	const disconnect = useCallback(() => {
		intentionalCloseRef.current = true;
		clearReconnect();
		socketRef.current?.close();
		socketRef.current = null;
		setStatus("idle");
		setReconnectAttempt(0);
	}, [clearReconnect]);

	// ── Send function ───────────────────────────────────────────────────────
	// Wraps JSON.stringify so callers can just pass objects.
	const send = useCallback((data: unknown) => {
		const socket = socketRef.current;
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.warn("[WebSocket] Cannot send — socket not open");
			return;
		}
		socket.send(JSON.stringify(data));
	}, []);

	// ── useEffect: connect on mount, disconnect on unmount ──────────────────
	// This is the React lifecycle integration.
	// Empty deps [] = run once on mount. Return function = cleanup on unmount.
	useEffect(() => {
		connect();
		return () => {
			intentionalCloseRef.current = true;
			clearReconnect();
			socketRef.current?.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { status, send, connect, disconnect, reconnectAttempt };
}
