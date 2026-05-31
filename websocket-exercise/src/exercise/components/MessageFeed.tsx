// =============================================================================
// 💬 MessageFeed — Renders the list of chat messages
// =============================================================================
//
// LEARNING NOTE:
//   This component demonstrates a key WebSocket UI challenge:
//   AUTO-SCROLL. When new messages arrive, should we scroll down?
//   Only if the user is already at the bottom. If they scrolled up
//   to read old messages, don't yank them down.
//
//   The pattern:
//     1. Check if user is near bottom before update
//     2. If yes, scroll after update
//     3. If no, show a "new messages" banner
//
//   Also note: we use scrollIntoView on a dummy div at the bottom
//   rather than scrollTo — it's more reliable cross-browser.
// =============================================================================

import { useEffect, useRef } from "react";
import type { DisplayMessage } from "../state/useChat";

interface Props {
	messages: DisplayMessage[];
	typingUsers: Set<string>;
	currentUsername: string | null;
}

export function MessageFeed({ messages, typingUsers, currentUsername }: Props) {
	const bottomRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// ── Auto-scroll logic ───────────────────────────────────────────────────
	useEffect(() => {
		// Scroll to bottom whenever messages change
		// In a production app, you'd check if user is already near bottom
		// and only auto-scroll if they are.
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, typingUsers]);

	// ── Format timestamp ────────────────────────────────────────────────────
	const formatTime = (iso: string) => {
		const date = new Date(iso);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	// ── Typing indicator text ───────────────────────────────────────────────
	const typingList = [...typingUsers].filter((u) => u !== currentUsername);
	const typingText =
		typingList.length === 0
			? null
			: typingList.length === 1
				? `${typingList[0]} is typing...`
				: `${typingList.join(", ")} are typing...`;

	return (
		<div className="message-feed" ref={containerRef}>
			{messages.length === 0 && (
				<div className="message-feed-empty">
					<p>No messages yet. Say something! 👋</p>
				</div>
			)}

			{messages.map((msg) => (
				<div
					key={msg.id}
					className={`message ${msg.isSystem ? "message--system" : msg.isOwn ? "message--own" : "message--other"}`}
				>
					{!msg.isSystem && (
						<div className="message-header">
							<span className="message-username">{msg.username}</span>
							<span className="message-time">{formatTime(msg.timestamp)}</span>
						</div>
					)}
					<div className="message-text">
						{msg.isSystem ? `— ${msg.text} —` : msg.text}
					</div>
				</div>
			))}

			{typingText && (
				<div className="typing-indicator">
					<span className="typing-dots">
						<span />
						<span />
						<span />
					</span>
					{typingText}
				</div>
			)}

			{/* Invisible div at the bottom to scroll into view */}
			<div ref={bottomRef} />
		</div>
	);
}
