/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  EXERCISE 2: Named Events                                    │
 * │                                                              │
 * │  🎯 Goal: Listen to different named events from a single     │
 * │     SSE connection and display them separately.              │
 * │                                                              │
 * │  📖 Concepts:                                                │
 * │     • Using source.addEventListener(eventName, handler)      │
 * │     • Handling multiple event types from one connection       │
 * │     • Differentiating event payloads                         │
 * │                                                              │
 * │  🔗 Endpoint: GET http://localhost:3001/api/named-events     │
 * │     Events:                                                  │
 * │       event: tick    → data: {"value": N}                    │
 * │       event: status  → data: {"status": "...", "timestamp"}  │
 * │       event: alert   → data: {"message": "...", "severity"}  │
 * │                                                              │
 * │  ✅ Hints:                                                   │
 * │     1. source.addEventListener("tick", (e) => ...)           │
 * │     2. source.addEventListener("status", (e) => ...)         │
 * │     3. source.addEventListener("alert", (e) => ...)          │
 * │     4. Don't forget to removeEventListener on cleanup!       │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect } from "react";

const SSE_URL = "http://localhost:3001/api/named-events";

interface TickData {
	value: number;
}

interface StatusData {
	status: string;
	timestamp: number;
}

interface AlertData {
	message: string;
	severity: "warning" | "critical";
}

export default function NamedEventsExercise() {
	const [ticks, setTicks] = useState<number>(0);
	const [statuses, setStatuses] = useState<StatusData[]>([]);
	const [alerts, setAlerts] = useState<AlertData[]>([]);

	useEffect(() => {
		const source = new EventSource(SSE_URL);
   const handleTick = (e: MessageEvent) => {                                      
       const data: TickData = JSON.parse(e.data);                                   
       setTicks(data.value);                                                        
     };                                                                             
     const handleStatus = (e: MessageEvent) => {                                    
       const data: StatusData = JSON.parse(e.data);                                 
       setStatuses((prev) => [...prev, data]);                                      
     };                                                                             
     const handleAlert = (e: MessageEvent) => {                                     
       const data: AlertData = JSON.parse(e.data);                                  
       setAlerts((prev) => [...prev, data]);                                        
     };    

		source.addEventListener("tick", handleTick);
		source.addEventListener("status", handleStatus);
		source.addEventListener("alert", handleAlert);	


		return () => {
			source.removeEventListener("tick", handleTick);
			source.removeEventListener("status", handleStatus);
			source.removeEventListener("alert", handleAlert);
			source.close();
		};
	}, []);

	// TODO: Create a useEffect that:
	//   1. Creates an EventSource connected to SSE_URL
	//   2. Adds event listeners for "tick", "status", and "alert"
	//   3. Updates the corresponding state for each event type
	//   4. Cleans up all listeners and closes the connection

	return (
		<section>
			<h2>Exercise 2: Named Events</h2>
			<p>Handle multiple event types from a single SSE connection.</p>

			<div
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
			>
				{/* Tick */}
				<div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
					<h3>⏱️ Tick</h3>
					<div style={{ fontSize: 32, textAlign: "center" }}>{ticks}</div>
				</div>

				{/* Status */}
				<div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
					<h3>📊 Status</h3>
					{statuses.length === 0 ? (
						<p style={{ color: "#999" }}>No statuses yet...</p>
					) : (
						<ul style={{ listStyle: "none", padding: 0, fontSize: 13 }}>
							{statuses.slice(-5).map((s, i) => (
								<li key={i} style={{ padding: "4px 0" }}>
									<span
										style={{
											color:
												s.status === "healthy"
													? "green"
													: s.status === "degraded"
														? "orange"
														: "red",
										}}
									>
										●
									</span>{" "}
									{s.status}
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Alerts */}
				<div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
					<h3>🚨 Alerts</h3>
					{alerts.length === 0 ? (
						<p style={{ color: "#999" }}>No alerts yet...</p>
					) : (
						<ul style={{ listStyle: "none", padding: 0, fontSize: 13 }}>
							{alerts.slice(-5).map((a, i) => (
								<li
									key={i}
									style={{
										padding: "4px 0",
										color: a.severity === "critical" ? "red" : "orange",
									}}
								>
									[{a.severity}] {a.message}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
}
