/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  EXERCISE 3: Chat Room                                       │
 * │                                                              │
 * │  🎯 Goal: Display a stream of chat messages, showing         │
 * │     typing indicators between messages.                      │
 * │                                                              │
 * │  📖 Concepts:                                                │
 * │     • Handling event IDs for resumption                     │
 * │     • Multiple event types (message, typing)                │
 * │     • Auto-scrolling to latest message                       │
 * │                                                              │
 * │  🔗 Endpoint: GET http://localhost:3001/api/chat             │
 * │     Events:                                                  │
 * │       event: message  → data: {"user", "text", "id", "ts"}   │
 * │       event: typing   → data: {"user"}                       │
 * │       Also sends: id: N (for Last-Event-Id resumption)       │
 * │                                                              │
 * │  ✅ Hints:                                                   │
 * │     1. Use a ref for auto-scroll: messagesEndRef.current?    │
 * │        .scrollIntoView({ behavior: "smooth" })               │
 * │     2. Show typing indicator between typing and message      │
 * │     3. Track messages in an array state                      │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState, useRef, useEffect } from "react";

const SSE_URL = "http://localhost:3001/api/chat";

interface ChatMessage {
	user: string;
	text: string;
	id: number;
	timestamp: number;
}

export default function ChatExercise() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [typingUser, setTypingUser] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);


	useEffect(() => {
		const source = new EventSource(SSE_URL);
		// source.onmessage = (event) => {
		// 	const data = JSON.parse(event.data);
		// 	setMessages((prev) => [...prev, data]);
		// 	setTypingUser(null);
		// }
		const handleMessage = (e: MessageEvent) => {
			const data = JSON.parse(e.data);
			setMessages((prev) => [...prev, {...data, timestamp: data.ts }]);
			setTypingUser(null);
		}

		const handleTyping = (e: MessageEvent) => {
			const data = JSON.parse(e.data);
			setTypingUser(data.user);
		}

		source.addEventListener("message", handleMessage);
		source.addEventListener("typing", handleTyping);

		return () => {
			source.removeEventListener("message", handleMessage);
			source.removeEventListener("typing", handleTyping);
			source.close();
		}
	}, []);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// TODO: Create a useEffect that:
	//   1. Creates an EventSource connected to SSE_URL
	//   2. On "message" event: append to messages, clear typingUser
	//   3. On "typing" event: set typingUser
	//   4. Auto-scroll to bottom on new messages (use a separate useEffect)
	//   5. Cleanup: close EventSource


	return (
		<section>
			<h2>Exercise 3: Chat Room</h2>
			<p>Display chat messages with typing indicators.</p>

			<div
				style={{
					height: 400,
					border: "1px solid #ddd",
					borderRadius: 8,
					overflowY: "auto",
					padding: 16,
					display: "flex",
					flexDirection: "column",
					gap: 8,
				}}
			>
				{messages.length === 0 && (
					<p style={{ color: "#999", textAlign: "center" }}>
						No messages yet — connect to the SSE endpoint!
					</p>
				)}
				{messages.map((msg) => (
					<div
						key={msg.id}
						style={{
							padding: "8px 12px",
							background: "#f5f5f5",
							borderRadius: 8,
							maxWidth: "80%",
						}}
					>
						<strong>{msg.user}</strong>{" "}
						<span style={{ fontSize: 11, color: "#999" }}>
							{new Date(msg.timestamp).toLocaleTimeString()}
						</span>
						<div>{msg.text}</div>
					</div>
				))}
				{typingUser && (
					<div
						style={{ color: "#999", fontStyle: "italic", padding: "4px 12px" }}
					>
						{typingUser} is typing...
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
		</section>
	);
}
