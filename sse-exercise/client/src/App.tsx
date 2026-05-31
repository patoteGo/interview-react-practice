import { useState } from "react";
import CounterExercise from "./exercises/Exercise1Counter";
import NamedEventsExercise from "./exercises/Exercise2NamedEvents";
import ChatExercise from "./exercises/Exercise3Chat";
import StockTickerExercise from "./exercises/Exercise4Stocks";
import FlakyConnectionExercise from "./exercises/Exercise5Flaky";

const tabs = [
	{ id: "1", label: "1. Counter", component: CounterExercise },
	{ id: "2", label: "2. Named Events", component: NamedEventsExercise },
	{ id: "3", label: "3. Chat Room", component: ChatExercise },
	{ id: "4", label: "4. Stock Ticker", component: StockTickerExercise },
	{ id: "5", label: "5. Flaky Connection", component: FlakyConnectionExercise },
] as const;

export default function App() {
	const [activeTab, setActiveTab] = useState<string>("1");
	const ActiveComponent = tabs.find((t) => t.id === activeTab)!.component;

	return (
		<div
			style={{
				maxWidth: 800,
				margin: "0 auto",
				padding: 24,
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<h1>📡 SSE Exercises</h1>
			<nav style={{ display: "flex", gap: 8, marginBottom: 24 }}>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						style={{
							padding: "8px 16px",
							border: "1px solid #ccc",
							borderRadius: 6,
							background: activeTab === tab.id ? "#1a1a2e" : "#fff",
							color: activeTab === tab.id ? "#fff" : "#1a1a2e",
							cursor: "pointer",
							fontWeight: activeTab === tab.id ? 600 : 400,
						}}
					>
						{tab.label}
					</button>
				))}
			</nav>
			<ActiveComponent />
		</div>
	);
}
