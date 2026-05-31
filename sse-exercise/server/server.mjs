import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

// ─── Helpers ────────────────────────────────────────────────────────
function sendSSE(res, event, data) {
	res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function sendSSEMessage(res, data) {
	res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// ─── Exercise 1: Basic counter ──────────────────────────────────────
// Sends an incrementing number every second.
// Event format: `data: {"count": N}`
app.get("/api/counter", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	let count = 0;
	const interval = setInterval(() => {
		count++;
		sendSSEMessage(res, { count });
	}, 1000);

	req.on("close", () => clearInterval(interval));
});

// ─── Exercise 2: Named events ──────────────────────────────────────
// Sends events with explicit `event:` field.
// Three event types: "tick", "status", "alert"
app.get("/api/named-events", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	let tick = 0;
	const statuses = ["healthy", "degraded", "healthy", "healthy", "unhealthy"];
	const alerts = [
		"CPU spike detected",
		"Memory usage back to normal",
		"Disk space running low",
		"All systems nominal",
		"Latency spike in us-east-1",
	];

	const interval = setInterval(() => {
		tick++;
		sendSSE(res, "tick", { value: tick });

		if (tick % 3 === 0) {
			sendSSE(res, "status", {
				status: statuses[tick % statuses.length],
				timestamp: Date.now(),
			});
		}

		if (tick % 5 === 0) {
			sendSSE(res, "alert", {
				message: alerts[Math.floor(tick / 5) % alerts.length],
				severity: tick % 10 === 0 ? "critical" : "warning",
			});
		}
	}, 1500);

	req.on("close", () => clearInterval(interval));
});

// ─── Exercise 3: Chat room ─────────────────────────────────────────
// Simulates a chat room with multiple users.
// Uses `event: message` with `id` field for last-event-id support.
const chatMessages = [
	{ user: "Alice", text: "Hey everyone! 👋" },
	{ user: "Bob", text: "Hi Alice! How's it going?" },
	{ user: "Charlie", text: "Just joined, what did I miss?" },
	{ user: "Alice", text: "Not much, just getting started" },
	{ user: "Diana", text: "Has anyone tried the new SSE API?" },
	{ user: "Bob", text: "Yeah, it's pretty straightforward" },
	{ user: "Charlie", text: "I prefer WebSockets tbh" },
	{ user: "Alice", text: "SSE is simpler for one-way data" },
	{ user: "Diana", text: "Agreed, and it auto-reconnects!" },
	{ user: "Bob", text: "True, but no bidirectional comms" },
	{ user: "Eve", text: "Hi! Am I late?" },
	{ user: "Charlie", text: "Fashionably late 😄" },
];

app.get("/api/chat", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	let index = 0;
	const lastEventId = parseInt(req.headers["last-event-id"] || "0", 10);
	if (lastEventId > 0) {
		index = lastEventId; // resume from where we left off
	}

	const interval = setInterval(() => {
		if (index < chatMessages.length) {
			const msg = chatMessages[index];
			res.write(`id: ${index}\n`);
			sendSSE(res, "message", {
				...msg,
				id: index,
				timestamp: Date.now(),
			});
			index++;
		} else {
			// Loop back with a "typing" indicator
			sendSSE(res, "typing", { user: "Alice" });
			setTimeout(() => {
				sendSSE(res, "message", {
					user: "Alice",
					text: `Random message at ${new Date().toLocaleTimeString()}`,
					id: index,
					timestamp: Date.now(),
				});
				res.write(`id: ${index}\n`);
				index++;
			}, 1500);
		}
	}, 2000);

	req.on("close", () => clearInterval(interval));
});

// ─── Exercise 4: Live stock ticker ─────────────────────────────────
// Sends rapid-fire updates for multiple stocks.
// Tests your ability to merge updates into state efficiently.
const stocks = [
	{ symbol: "AAPL", price: 189.5 },
	{ symbol: "GOOGL", price: 141.8 },
	{ symbol: "MSFT", price: 378.9 },
	{ symbol: "AMZN", price: 178.25 },
	{ symbol: "TSLA", price: 248.4 },
];

app.get("/api/stocks", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	const interval = setInterval(() => {
		// Pick a random stock, jitter the price
		const stock = stocks[Math.floor(Math.random() * stocks.length)];
		const change = (Math.random() - 0.5) * 4;
		stock.price = Math.round((stock.price + change) * 100) / 100;

		sendSSE(res, "price", {
			symbol: stock.symbol,
			price: stock.price,
			change: Math.round(change * 100) / 100,
			timestamp: Date.now(),
		});
	}, 300);

	req.on("close", () => clearInterval(interval));
});

// ─── Exercise 5: Flaky connection ──────────────────────────────────
// Randomly drops the connection to test reconnection logic.
// Sends a countdown, then intentionally closes.
app.get("/api/flaky", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	let count = 0;
	const maxBeforeDrop = 5 + Math.floor(Math.random() * 5); // drop after 5-10 messages

	const interval = setInterval(() => {
		count++;

		if (count >= maxBeforeDrop) {
			sendSSE(res, "status", {
				message: "Connection unstable... reconnecting",
				code: "UNSTABLE",
			});
			// Simulate a crash
			setTimeout(() => {
				res.end();
			}, 100);
			return;
		}

		sendSSE(res, "status", {
			message: `Stable (${count}/${maxBeforeDrop} until dropout)`,
			code: "OK",
			uptime: count,
		});
	}, 1000);

	req.on("close", () => clearInterval(interval));
});

// ─── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`\n🚀 SSE Exercise Server running on http://localhost:${PORT}`);
	console.log(`\nAvailable endpoints:`);
	console.log(`  GET /api/counter        → Basic counter (Exercise 1)`);
	console.log(`  GET /api/named-events   → Named events (Exercise 2)`);
	console.log(`  GET /api/chat           → Chat room (Exercise 3)`);
	console.log(`  GET /api/stocks         → Stock ticker (Exercise 4)`);
	console.log(`  GET /api/flaky          → Flaky connection (Exercise 5)`);
	console.log();
});
