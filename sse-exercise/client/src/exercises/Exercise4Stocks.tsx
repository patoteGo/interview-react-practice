/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  EXERCISE 4: Live Stock Ticker                               │
 * │                                                              │
 * │  🎯 Goal: Display real-time stock prices that update very    │
 * │     rapidly (~3 updates/sec). Merge updates into state.      │
 * │                                                              │
 * │  📖 Concepts:                                                │
 * │     • High-frequency SSE updates                             │
 * │     • Merging updates into a map/object for O(1) lookup     │
 * │     • Derived state computation                              │
 * │                                                              │
 * │  🔗 Endpoint: GET http://localhost:3001/api/stocks           │
 * │     Events:                                                  │
 * │       event: price → data: {"symbol", "price", "change", "ts"}│
 * │     Updates arrive every ~300ms                               │
 * │                                                              │
 * │  ✅ Hints:                                                   │
 * │     1. Store prices as Record<string, PriceUpdate> for O(1) │
 * │     2. Use functional state update:                          │
 * │        setPrices(prev => ({ ...prev, [symbol]: data }))      │
 * │     3. Color code: green for positive change, red for neg   │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useState } from "react";

const SSE_URL = "http://localhost:3001/api/stocks";

interface PriceUpdate {
	symbol: string;
	price: number;
	change: number;
	timestamp: number;
}

export default function StockTickerExercise() {
	const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
	const [connected, setConnected] = useState(false);

	// TODO: Create a useEffect that:
	//   1. Creates an EventSource connected to SSE_URL
	//   2. Listens for "price" events
	//   3. Merges each update into the prices record
	//      setPrices(prev => ({ ...prev, [data.symbol]: data }))
	//   4. Track connection status
	//   5. Cleanup

	const priceList = Object.values(prices).sort((a, b) =>
		a.symbol.localeCompare(b.symbol),
	);

	return (
		<section>
			<h2>Exercise 4: Stock Ticker</h2>
			<p>High-frequency price updates — merge efficiently into state.</p>

			<div
				style={{
					fontSize: 14,
					color: connected ? "green" : "red",
					marginBottom: 12,
				}}
			>
				{connected
					? "🟢 Live"
					: "🔴 Not connected — implement the SSE connection!"}
			</div>

			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
						<th style={{ padding: 8 }}>Symbol</th>
						<th style={{ padding: 8 }}>Price</th>
						<th style={{ padding: 8 }}>Change</th>
						<th style={{ padding: 8 }}>Updated</th>
					</tr>
				</thead>
				<tbody>
					{priceList.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								style={{ padding: 24, textAlign: "center", color: "#999" }}
							>
								Waiting for data...
							</td>
						</tr>
					) : (
						priceList.map((stock) => (
							<tr key={stock.symbol} style={{ borderBottom: "1px solid #eee" }}>
								<td style={{ padding: 8, fontWeight: 600 }}>{stock.symbol}</td>
								<td style={{ padding: 8, fontVariantNumeric: "tabular-nums" }}>
									${stock.price.toFixed(2)}
								</td>
								<td
									style={{
										padding: 8,
										fontVariantNumeric: "tabular-nums",
										color: stock.change >= 0 ? "green" : "red",
									}}
								>
									{stock.change >= 0 ? "+" : ""}
									{stock.change.toFixed(2)}
								</td>
								<td style={{ padding: 8, color: "#999", fontSize: 12 }}>
									{new Date(stock.timestamp).toLocaleTimeString()}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</section>
	);
}
