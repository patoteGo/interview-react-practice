// =============================================================================
// 🏠 App.tsx — Main chat application
// =============================================================================
//
// ARCHITECTURE:
//
//   ┌──────────────────────────────────────────────┐
//   │  App                                          │
//   │  ├── useChat()  ── all state + actions        │
//   │  │     └── useWebSocket()  ── transport layer │
//   │  ├── UsernamePrompt  (if not joined)          │
//   │  └── Chat Layout     (if joined)              │
//   │       ├── ConnectionBadge                     │
//   │       ├── UserList                            │
//   │       ├── MessageFeed                         │
//   │       └── Composer                            │
//   └──────────────────────────────────────────────┘
//
// DATA FLOW:
//
//   Server ──ws──▶ useWebSocket.onMessage ──▶ useChat.handleMessage ──▶ setState ──▶ re-render
//
//   User types ──▶ Composer.onSend ──▶ useChat.sendMessage ──▶ useWebSocket.send ──▶ Server
//
// Every piece has a single responsibility:
//   - useWebSocket: connection lifecycle
//   - useChat: what messages MEAN
//   - Components: how things LOOK
// =============================================================================

import { useChat } from "./exercise/state/useChat";
import { ConnectionBadge } from "./exercise/components/ConnectionBadge";
import { MessageFeed } from "./exercise/components/MessageFeed";
import { Composer } from "./exercise/components/Composer";
import { UserList } from "./exercise/components/UserList";
import { UsernamePrompt } from "./exercise/components/UsernamePrompt";

export default function App() {
	const {
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
	} = useChat();

	return (
		<div className="app">
			{/* ── Header ─────────────────────────────────────────────────────── */}
			<header className="app-header">
				<h1 className="app-title">💬 WebSocket Chat</h1>
				<ConnectionBadge status={status} reconnectAttempt={reconnectAttempt} />
			</header>

			{/* ── Not joined yet: show username prompt ───────────────────────── */}
			{!hasJoined ? (
				<UsernamePrompt onJoin={join} disabled={status !== "connected"} />
			) : (
				/* ── Joined: show the chat interface ───────────────────────────── */
				<div className="chat-layout">
					{/* Sidebar: user list */}
					<aside className="chat-sidebar">
						<UserList users={onlineUsers} currentUsername={username} />
					</aside>

					{/* Main area: messages + input */}
					<main className="chat-main">
						<MessageFeed
							messages={messages}
							typingUsers={typingUsers}
							currentUsername={username}
						/>
						<Composer
							onSend={sendMessage}
							onTyping={startTyping}
							disabled={false}
							status={status}
						/>
					</main>
				</div>
			)}

			{/* ── Footer: learning hints ─────────────────────────────────────── */}
			<footer className="app-footer">
				<p className="muted">
					Open this page in <strong>two browser tabs</strong> to chat across
					them. Kill the server to see reconnect behavior.
				</p>
			</footer>
		</div>
	);
}
