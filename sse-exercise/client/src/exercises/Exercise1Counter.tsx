/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  EXERCISE 1: Basic SSE Counter                              │
 * │                                                              │
 * │  🎯 Goal: Connect to /api/counter and display the           │
 * │     incrementing count in real-time.                         │
 * │                                                              │
 * │  📖 Concepts:                                                │
 * │     • Creating an EventSource                                │
 * │     • Listening to message events                            │
 * │     • Cleaning up on unmount                                 │
 * │                                                              │
 * │  🔗 Endpoint: GET http://localhost:3001/api/counter          │
 * │     Sends: data: {"count": N} every 1s                      │
 * │                                                              │
 * │  ✅ Hints (scroll down):                                     │
 * │     1. new EventSource(url)                                  │
 * │     2. source.onmessage = (e) => setData(JSON.parse(e.data))│
 * │     3. return () => source.close() in useEffect              │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect } from "react";

const SSE_URL = "http://localhost:3001/api/counter";

export default function CounterExercise() {
	const [count, setCount] = useState<number>(0);
	const [connected, setConnected] = useState(false);

	// TODO: Create a useEffect that:
	//   1. Creates an EventSource connected to SSE_URL
	//   2. Listens for "message" events and parses the count
	//   3. Updates the `count` state
	//   4. Sets `connected` to true on open, false on error
	//   5. Returns a cleanup function that closes the EventSource

	console.log('up1')
	useEffect(() => {
		console.log('useeffect up')
		const source = new EventSource(SSE_URL);
		source.onopen = () => setConnected(true);
		source.onerror = () => setConnected(false);
		source.onmessage = (e) => {
			const data = JSON.parse(e.data);
			setCount(data.count);
		}
		return () => {
			source.close();
		}
	}, []);
	// source.onmessage = (e) => setCount(JSON.parse(e.data));


	return (
		<section>
			<h2>Exercise 1: Basic Counter</h2>
			<p>Connect to the SSE endpoint and watch the counter tick up.</p>

			<div
				style={{
					padding: 24,
					border: "1px solid #ddd",
					borderRadius: 8,
					textAlign: "center",
				}}
			>
				<div style={{ fontSize: 48, fontVariantNumeric: "tabular-nums" }}>
					{count}
				</div>
				<div
					style={{
						marginTop: 8,
						fontSize: 14,
						color: connected ? "green" : "red",
					}}
				>
					{connected
						? "🟢 Connected"
						: "🔴 Disconnected — implement the SSE connection!"}
				</div>
			</div>
		</section>
	);
}
