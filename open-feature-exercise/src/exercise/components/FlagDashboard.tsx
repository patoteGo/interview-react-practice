// ─────────────────────────────────────────────────────────────
// Dev Tool: FlagDashboard
//
// This component shows the CURRENT state of all flags and
// lets you toggle them at runtime for testing.
//
// NOT part of the exercise — but useful for debugging.
// Read this file to understand how flag state flows through
// the system.
// ─────────────────────────────────────────────────────────────

import {
	useBooleanFlagDetails,
	useStringFlagDetails,
} from "@openfeature/react-sdk";
import { BooleanFlags, StringFlags } from "../flags/flagKeys";

export function FlagDashboard() {
	return (
		<section
			className="card"
			style={{ borderColor: "rgba(56, 189, 248, 0.3)" }}
		>
			<h2>🛠️ Flag Dashboard (dev only)</h2>
			<p className="muted" style={{ marginBottom: "1rem" }}>
				Live flag evaluation results. Toggle flags by editing
				<code> src/exercise/provider/createFlagsProvider.ts</code>
			</p>

			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					fontSize: "0.875rem",
				}}
			>
				<thead>
					<tr
						style={{
							borderBottom: "1px solid rgba(148,163,184,0.2)",
							textAlign: "left",
						}}
					>
						<th style={{ padding: "0.5rem" }}>Flag</th>
						<th style={{ padding: "0.5rem" }}>Value</th>
						<th style={{ padding: "0.5rem" }}>Reason</th>
					</tr>
				</thead>
				<tbody>
					<FlagRowBoolean
						flagKey={BooleanFlags.showPoints}
						defaultValue={false}
					/>
					<FlagRowBoolean
						flagKey={BooleanFlags.enableBetaSearch}
						defaultValue={false}
					/>
					<FlagRowString
						flagKey={StringFlags.useNewCheckout}
						defaultValue="list"
					/>
					<FlagRowString
						flagKey={StringFlags.pricingVariant}
						defaultValue="default"
					/>
				</tbody>
			</table>

			<p
				className="muted"
				style={{ marginTop: "0.75rem", fontSize: "0.75rem" }}
			>
				💡 Reason = STATIC means the value comes from hardcoded config.
				TARGETING_MATCH means a contextEvaluator rule matched. DEFAULT means the
				flag was not found.
			</p>
		</section>
	);
}

/** Row for a boolean flag */
function FlagRowBoolean({
	flagKey,
	defaultValue,
}: {
	flagKey: string;
	defaultValue: boolean;
}) {
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { value, reason } = useBooleanFlagDetails(flagKey, defaultValue);
		return (
			<tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
				<td style={{ padding: "0.5rem" }}>
					<code>{flagKey}</code>
				</td>
				<td style={{ padding: "0.5rem" }}>{String(value)}</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					{String(reason)}
				</td>
			</tr>
		);
	} catch {
		return (
			<tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
				<td style={{ padding: "0.5rem" }}>
					<code>{flagKey}</code>
				</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					not registered
				</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					—
				</td>
			</tr>
		);
	}
}

/** Row for a string flag */
function FlagRowString({
	flagKey,
	defaultValue,
}: {
	flagKey: string;
	defaultValue: string;
}) {
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { value, reason } = useStringFlagDetails(flagKey, defaultValue);
		return (
			<tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
				<td style={{ padding: "0.5rem" }}>
					<code>{flagKey}</code>
				</td>
				<td style={{ padding: "0.5rem" }}>{String(value)}</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					{String(reason)}
				</td>
			</tr>
		);
	} catch {
		return (
			<tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
				<td style={{ padding: "0.5rem" }}>
					<code>{flagKey}</code>
				</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					not registered
				</td>
				<td style={{ padding: "0.5rem" }} className="muted">
					—
				</td>
			</tr>
		);
	}
}
