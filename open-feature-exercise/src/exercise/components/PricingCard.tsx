// ─────────────────────────────────────────────────────────────
// Exercise Component: PricingCard
//
// FLAG: pricingVariant (string: 'default' | 'discount' | 'premium')
// CONCEPT: A flag that controls business behavior, not just UI.
//          Different users see different prices — this is an
//          A/B test / progressive delivery pattern.
//
// What you'll learn:
//   - String variant flags for multi-option behavior
//   - Business logic branching (not just UI tweaks)
//   - What could go wrong if the default is wrong
// ─────────────────────────────────────────────────────────────

// TODO: Import hooks
// import { useStringFlagValue } from '@openfeature/react-sdk';
// import { StringFlags } from '../flags/flagKeys';

const pricingOptions = {
	default: {
		label: "Standard",
		price: "$29/mo",
		features: ["5 projects", "Basic analytics", "Email support"],
	},
	discount: {
		label: "Early Bird 🐦",
		price: "$19/mo",
		features: [
			"5 projects",
			"Basic analytics",
			"Email support",
			"Priority queue",
		],
	},
	premium: {
		label: "Premium ⭐",
		price: "$49/mo",
		features: [
			"Unlimited projects",
			"Advanced analytics",
			"24/7 support",
			"Custom integrations",
		],
	},
};

export function PricingCard() {
	// TODO: Read the variant flag
	// const variant = useStringFlagValue(StringFlags.pricingVariant, 'default');

	// FOR NOW: hardcoded
	const variant = "default" as keyof typeof pricingOptions; // <-- delete and use the flag

	const plan = pricingOptions[variant] ?? pricingOptions.default;

	return (
		<section className="card">
			<h2>💳 Pricing</h2>
			<p className="muted">
				Active variant: <code>{variant}</code>
			</p>

			<div
				style={{
					marginTop: "1rem",
					padding: "1rem",
					borderRadius: "12px",
					border:
						variant === "discount"
							? "1px solid rgba(74, 222, 128, 0.4)"
							: variant === "premium"
								? "1px solid rgba(250, 204, 21, 0.4)"
								: "1px solid rgba(148, 163, 184, 0.2)",
					background: "rgba(0,0,0,0.2)",
				}}
			>
				<h3>{plan.label}</h3>
				<p style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>
					{plan.price}
				</p>
				<ul>
					{plan.features.map((f) => (
						<li key={f}>{f}</li>
					))}
				</ul>
			</div>

			{/*
        THINK ABOUT IT:
        - What if the provider is down? → 'default' is safest (no surprise discounts)
        - Is this flag temporary? → Yes, A/B test. Remove after experiment.
        - What if someone gets 'premium' for free? → Revenue loss.
      */}
		</section>
	);
}
