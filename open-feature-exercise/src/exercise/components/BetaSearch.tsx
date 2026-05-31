// ─────────────────────────────────────────────────────────────
// Exercise Component: BetaSearch
//
// FLAGS: enableBetaSearch (boolean) + evaluation context (Level 3)
// CONCEPT: A feature that only admins can see — combining a
//          boolean flag with targeting context.
//
// What you'll learn:
//   - Boolean flag for feature visibility
//   - Context-aware evaluation (only admins get 'on')
//   - Progressive rollout mindset: ship code hidden, expose gradually
// ─────────────────────────────────────────────────────────────

// TODO: Import hooks
// import { useBooleanFlagValue } from '@openfeature/react-sdk';
// import { BooleanFlags } from '../flags/flagKeys';

export function BetaSearch() {
	// TODO: Read the flag (Level 1 — simple boolean)
	// const enabled = useBooleanFlagValue(BooleanFlags.enableBetaSearch, false);

	// FOR NOW: hardcoded
	const enabled = false; // <-- delete and use the flag

	if (!enabled) {
		// Flag is off → render nothing (or a placeholder)
		return (
			<section className="card">
				<h2>🔍 Search</h2>
				<p className="muted">Standard search coming soon.</p>
			</section>
		);
	}

	// Flag is on → show the EXPERIMENTAL feature
	// In Level 3, this only renders for admins because the
	// provider's contextEvaluator checks ctx.role === 'admin'

	return (
		<section
			className="card"
			style={{ borderColor: "rgba(250, 204, 21, 0.4)" }}
		>
			<h2>🔍 Beta Search</h2>
			<p className="muted" style={{ color: "#facc15" }}>
				⚡ Experimental feature — admin only
			</p>
			<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
				<input
					type="text"
					placeholder="Search with AI-powered suggestions..."
					style={{
						flex: 1,
						padding: "0.5rem 0.75rem",
						borderRadius: "8px",
						border: "1px solid rgba(250, 204, 21, 0.3)",
						background: "rgba(0,0,0,0.3)",
						color: "#e5e7eb",
					}}
				/>
				<button
					style={{
						padding: "0.5rem 1rem",
						borderRadius: "8px",
						border: "none",
						background: "#facc15",
						color: "#0f172a",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					Search
				</button>
			</div>
		</section>
	);
}
