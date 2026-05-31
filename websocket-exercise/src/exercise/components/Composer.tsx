// =============================================================================
// ✏️ Composer — Message input + send button
// =============================================================================
//
// LEARNING NOTE:
//   This seems simple but has important UX considerations:
//
//   1. Enter to send, Shift+Enter for newline (standard chat UX)
//   2. Clear input after sending
//   3. Focus the input after sending (so user can keep typing)
//   4. Disable when disconnected
//   5. (Bonus) Send typing indicator while the user types
//
//   The typing indicator uses a debounce pattern: we send the
//   "user.typing" event at most once every 500ms while the user types.
// =============================================================================

import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import type { ConnectionStatus } from "../protocol/types";

interface Props {
	onSend: (text: string) => void;
	onTyping?: () => void;
	disabled: boolean;
	status: ConnectionStatus;
}

export function Composer({ onSend, onTyping, disabled, status }: Props) {
	const [text, setText] = useState("");
	const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const isConnected = status === "connected";

	const handleSend = useCallback(() => {
		const trimmed = text.trim();
		if (!trimmed || disabled) return;
		onSend(trimmed);
		setText("");
		inputRef.current?.focus();
	}, [text, disabled, onSend]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	// ── Typing indicator with debounce ──────────────────────────────────────
	const handleInput = useCallback(
		(value: string) => {
			setText(value);

			if (!onTyping || !isConnected) return;

			// Only send typing event once every 500ms
			if (!typingDebounceRef.current) {
				onTyping();
			}

			if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
			typingDebounceRef.current = setTimeout(() => {
				typingDebounceRef.current = null;
			}, 500);
		},
		[onTyping, isConnected],
	);

	const placeholder = !isConnected
		? "Connecting..."
		: disabled
			? "Join to start chatting..."
			: "Type a message...";

	return (
		<div className="composer">
			<input
				ref={inputRef}
				className="composer-input"
				type="text"
				value={text}
				onChange={(e) => handleInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={!isConnected || disabled}
				autoComplete="off"
			/>
			<button
				className="composer-btn"
				onClick={handleSend}
				disabled={!isConnected || disabled || !text.trim()}
			>
				Send
			</button>
		</div>
	);
}
