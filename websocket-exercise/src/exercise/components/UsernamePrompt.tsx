// =============================================================================
// 🏷️ UsernamePrompt — First screen: pick a username before joining
// =============================================================================
//
// LEARNING NOTE:
//   This is a common pattern: collect user info BEFORE connecting
//   or right after connecting. Our flow is:
//     1. WebSocket connects automatically
//     2. User sees this prompt
//     3. User types name and hits Enter
//     4. We send "user.join" to the server
//     5. Server responds with "user.joined" (isYou: true)
//     6. useChat sets hasJoined = true
//     7. Chat UI appears
//
//   The form is simple: input + button. Enter submits.
// =============================================================================

import { useState, useCallback, type KeyboardEvent } from "react";

interface Props {
	onJoin: (username: string) => void;
	disabled: boolean;
}

export function UsernamePrompt({ onJoin, disabled }: Props) {
	const [name, setName] = useState("");

	const handleJoin = useCallback(() => {
		const trimmed = name.trim();
		if (trimmed) onJoin(trimmed);
	}, [name, onJoin]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") handleJoin();
		},
		[handleJoin],
	);

	return (
		<div className="username-prompt">
			<div className="username-card">
				<h2>Join the chat</h2>
				<p>Pick a name and start chatting in real-time across browser tabs.</p>
				<div className="username-form">
					<input
						className="username-input"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Your name..."
						maxLength={20}
						autoFocus
						disabled={disabled}
					/>
					<button
						className="username-btn"
						onClick={handleJoin}
						disabled={!name.trim() || disabled}
					>
						Join
					</button>
				</div>
				{disabled && (
					<p className="username-waiting">Connecting to server...</p>
				)}
			</div>
		</div>
	);
}
