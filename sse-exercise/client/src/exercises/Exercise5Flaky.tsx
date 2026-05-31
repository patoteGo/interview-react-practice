/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  EXERCISE 5: Flaky Connection (Bonus)                        │
 * │                                                              │
 * │  🎯 Goal: Handle an unreliable SSE connection that drops     │
 * │     randomly. Show reconnection status and event history.    │
 * │                                                              │
 * │  📖 Concepts:                                                │
 * │     • EventSource auto-reconnect behavior                    │
 * │     • Handling source.onerror / readyState                   │
 * │     • Detecting CONNECTING vs CLOSED states                  │
 * │     • Tracking reconnection count                            │
 * │                                                              │
 * │  🔗 Endpoint: GET http://localhost:3001/api/flaky            │
 * │     Events:                                                  │
 * │       event: status → data: {"message", "code", "uptime?"}   │
 * │     Connection drops after 5-10 messages randomly.           │
 * │                                                              │
 * │  ✅ Hints:                                                   │
 * │     1. EventSource auto-reconnects! Just handle onerror:     │
 * │        if (source.readyState === EventSource.CLOSED) ...     │
 * │     2. Track reconnection count via onopen events            │
 * │     3. Log every status event to a history array             │
 * │     4. Show different UI for OK vs UNSTABLE status           │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState } from "react";

const SSE_URL = "http://localhost:3001/api/flaky";

interface StatusEvent {
	message: string;
	code: "OK" | "UNSTABLE";
	uptime?: number;
	receivedAt: number;
}

export default function FlakyConnectionExercise() {
	const [history, setHistory] = useState<StatusEvent[]>([]);
	const [reconnectCount, setReconnectCount] = useState(0);
	const [status, setStatus] = useState<
		"disconnected" | "connecting" | "connected"
	>("disconnected");

	// TODO: Create a useEffect that:
	//   1. Creates an EventSource connected to SSE_URL
	//   2. On "status" event: append to history, update status
	//   3. On "open": increment reconnectCount, set status "connected"
	//   4. On "error":
	//        - If readyState === CONNECTING → status "connecting"
	//        - If readyState === CLOSED → status "disconnected"
	//   5. Cleanup: close EventSource

	return (
		<section>
			<h2>Exercise 5: Flaky Connection</h2>
			<p>Handle dropped connections and auto-reconnection.</p>

			<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
				<div
					style={{
						padding: "8px 16px",
						borderRadius: 8,
						background:
							status === "connected"
								? "#d4edda"
								: status === "connecting"
									? "#fff3cd"
									: "#f8d7da",
						fontWeight: 600,
					}}
				>
					{status === "connected"
						? "🟢 Connected"
						: status === "connecting"
							? "🟡 Reconnecting..."
							: "🔴 Disconnected"}
				</div>
				<div
					style={{
						padding: "8px 16px",
						background: "#f5f5f5",
						borderRadius: 8,
					}}
				>
					Reconnections: {reconnectCount}
				</div>
			</div>

			<div
				style={{
					height: 300,
					overflowY: "auto",
					border: "1px solid #ddd",
					borderRadius: 8,
					padding: 12,
					fontFamily: "monospace",
					fontSize: 13,
				}}
			>
				{history.length === 0 ? (
					<p style={{ color: "#999" }}>
						No events received — implement the SSE connection!
					</p>
				) : (
					[...history].reverse().map((event, i) => (
						<div
							key={i}
							style={{ padding: "4px 0", borderBottom: "1px solid #f0f0f0" }}
						>
							<span style={{ color: "#999" }}>
								{new Date(event.receivedAt).toLocaleTimeString()}
							</span>{" "}
							<span style={{ color: event.code === "OK" ? "green" : "red" }}>
								[{event.code}]
							</span>{" "}
							{event.message}
						</div>
					))
				)}
			</div>
		</section>
	);
}
