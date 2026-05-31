// =============================================================================
// 📡 WEBSOCKET CHAT SERVER
// =============================================================================
//
// HOW TO RUN:  npm run server
// LISTENS ON:  ws://localhost:4003
//
// WHAT THIS DOES:
//   1. Accepts WebSocket connections from browser clients
//   2. Tracks connected users (with usernames)
//   3. Broadcasts chat messages to ALL connected clients
//   4. Sends join/leave notifications
//   5. Sends periodic heartbeat ticks
//
// KEY CONCEPTS:
//   - "ws" is a popular Node.js WebSocket library
//   - WebSocketServer listens for upgrade requests (HTTP → WS)
//   - Each "connection" event = one client browser tab
//   - wss.clients is a Set of all connected sockets
//   - broadcast = loop over all clients and .send() to each
//
// TRY THIS:
//   - Open 2 browser tabs → both see each other's messages
//   - Kill the server → clients see "close" event
//   - Restart server → clients can reconnect
// =============================================================================

import { WebSocketServer } from "ws";

const PORT = 4003;

// --- State: connected users ------------------------------------------------
// In production you'd use Redis or a DB. Here we use a simple Map.
// Key: socket object, Value: { username, joinedAt }
const users = new Map();

// --- Helper: broadcast to every connected client ----------------------------
const broadcast = (message) => {
	const payload = JSON.stringify(message);
	// wss.clients is a Set<WebSocket> — all currently connected sockets
	// readyState 1 = OPEN (only send to open connections)
	wss.clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(payload);
		}
	});
};

// --- Helper: get array of usernames ----------------------------------------
const getUserList = () => [...users.values()].map((u) => u.username);

// --- Create the server -----------------------------------------------------
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
	// ── STEP 1: Client just connected ──────────────────────────────────────
	// The server doesn't know the username yet. Send a welcome message
	// and ask the client to identify themselves.
	socket.send(
		JSON.stringify({
			type: "system.connected",
			payload: {
				message: "Connected to chat server! Send user.join with your name.",
				timestamp: new Date().toISOString(),
			},
		}),
	);

	// ── Heartbeat: prove the connection is alive every 5s ──────────────────
	// In production you'd use ping/pong frames. This is the simplified version.
	const heartbeat = setInterval(() => {
		if (socket.readyState === 1) {
			socket.send(
				JSON.stringify({
					type: "system.tick",
					payload: { timestamp: new Date().toISOString() },
				}),
			);
		}
	}, 15000);

	// ── STEP 2: Listen for messages from THIS client ───────────────────────
	socket.on("message", (data) => {
		let parsed;

		// ── Guard: reject non-JSON messages ─────────────────────────────────
		try {
			parsed = JSON.parse(String(data));
		} catch {
			socket.send(
				JSON.stringify({
					type: "system.error",
					payload: { message: "Malformed JSON. Send { type, payload }." },
				}),
			);
			return;
		}

		const { type, payload } = parsed;

		switch (type) {
			// ── User joins with a name ────────────────────────────────────────
			case "user.join": {
				const username = String(payload?.username || "Anonymous");
				users.set(socket, { username, joinedAt: Date.now() });

				// Tell this user they're in
				socket.send(
					JSON.stringify({
						type: "user.joined",
						payload: { username, isYou: true, users: getUserList() },
					}),
				);

				// Tell everyone else
				broadcast({
					type: "user.joined",
					payload: { username, isYou: false, users: getUserList() },
				});
				break;
			}

			// ── Chat message from a user ──────────────────────────────────────
			case "chat.message": {
				const user = users.get(socket);
				if (!user) {
					socket.send(
						JSON.stringify({
							type: "system.error",
							payload: {
								message:
									'Join first: send { type: "user.join", payload: { username } }',
							},
						}),
					);
					return;
				}

				const text = String(payload?.text || "").trim();
				if (!text) return;

				// Broadcast to everyone (including sender)
				// The sender's client will also receive this — that's how they
				// know the server accepted the message.
				broadcast({
					type: "chat.message",
					payload: {
						id: crypto.randomUUID(),
						username: user.username,
						text,
						timestamp: new Date().toISOString(),
					},
				});
				break;
			}

			// ── Typing indicator ──────────────────────────────────────────────
			case "user.typing": {
				const user = users.get(socket);
				if (!user) return;
				broadcast({
					type: "user.typing",
					payload: { username: user.username },
				});
				break;
			}

			default:
				socket.send(
					JSON.stringify({
						type: "system.error",
						payload: { message: `Unknown type: "${type}"` },
					}),
				);
		}
	});

	// ── STEP 3: Client disconnected ────────────────────────────────────────
	socket.on("close", () => {
		clearInterval(heartbeat);
		const user = users.get(socket);
		users.delete(socket);

		if (user) {
			broadcast({
				type: "user.left",
				payload: { username: user.username, users: getUserList() },
			});
		}
	});
});

console.log(`\n  💬 Chat WebSocket server running at ws://localhost:${PORT}`);
console.log(`  Open http://localhost:5173 in two browser tabs to test!\n`);
