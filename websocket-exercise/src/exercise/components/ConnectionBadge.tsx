// =============================================================================
// 🟢 ConnectionBadge — Shows WebSocket connection status
// =============================================================================
//
// LEARNING NOTE:
//   This is the simplest component but teaches an important lesson:
//   ALWAYS show connection state to the user. In real apps, users get
//   confused when things silently stop working.
//
//   The badge color changes based on status:
//     idle        → gray    (not connected)
//     connecting  → yellow  (trying...)
//     connected   → green   (good!)
//     disconnected → red    (lost connection)
//     reconnecting → orange  (trying again...)
// =============================================================================

import type { ConnectionStatus } from "../protocol/types";

interface Props {
	status: ConnectionStatus;
	reconnectAttempt: number;
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string }> =
	{
		idle: { label: "Not connected", color: "#64748b" },
		connecting: { label: "Connecting...", color: "#facc15" },
		connected: { label: "Connected", color: "#4ade80" },
		disconnected: { label: "Disconnected", color: "#f87171" },
		reconnecting: { label: "Reconnecting...", color: "#fb923c" },
	};

export function ConnectionBadge({ status, reconnectAttempt }: Props) {
	const config = statusConfig[status];

	return (
		<div
			className="connection-badge"
			style={{ "--badge-color": config.color } as React.CSSProperties}
		>
			<span className="badge-dot" />
			<span className="badge-label">{config.label}</span>
			{reconnectAttempt > 0 && status !== "connected" && (
				<span className="badge-attempt">attempt {reconnectAttempt}</span>
			)}
		</div>
	);
}
