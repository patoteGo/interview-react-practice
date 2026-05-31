// ─────────────────────────────────────────────────────────────
// Exercise Component: PointsColumn
//
// FLAG: showPoints (boolean)
// CONCEPT: The simplest flag pattern — show or hide a UI element.
//
// What you'll learn:
//   - useBooleanFlagValue for on/off flags
//   - Why "off" is the safest default (hidden = safe, shown = risk)
//   - Flag evaluation is CLOSE to where behavior changes
// ─────────────────────────────────────────────────────────────

// TODO: Import the hook you need
// import { useBooleanFlagValue } from '@openfeature/react-sdk';
// import { BooleanFlags } from '../flags/flagKeys';

export function PointsColumn() {
	// TODO: Read the boolean flag
	// const showPoints = useBooleanFlagValue(BooleanFlags.showPoints, false);
	//                                                          ^^^^^ IMPORTANT: safe default

	// FOR NOW: hardcoded so the component renders
	const showPoints = false; // <-- delete this line and use the flag

	return (
		<section className="card">
			<h2>🏆 Loyalty Points</h2>

			{/*
        TODO: Guard the points display with the flag.
        
        The flag controls BEHAVIOR: showing sensitive data.
        If the flag is off, users see nothing — no numbers, no UI.

        HINT: This is a one-liner conditional render.
      */}

			{showPoints ? (
				<div className="points-display">
					<span className="points-number">1,247</span>
					<p className="muted">points earned this month</p>
				</div>
			) : (
				<p className="muted">
					Points program is currently unavailable. Check back soon!
				</p>
			)}
		</section>
	);
}
