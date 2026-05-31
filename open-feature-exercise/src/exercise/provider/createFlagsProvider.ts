// ─────────────────────────────────────────────────────────────
// Step 2: Create an in-memory flag provider
//
// The provider is the "source of truth" for flag values.
// In production you'd use LaunchDarkly, Split, Flipt, etc.
// For this exercise we use InMemoryProvider with hardcoded values.
//
// Pattern:
//   1. Define flag configuration (variants + default)
//   2. Create InMemoryProvider with that config
//   3. Register it with OpenFeature.setProvider()
//   4. Wrap your app in <OpenFeatureProvider>
//
// Key concept: DEFAULT VALUES
//   The `defaultVariant` is what users get if evaluation fails
//   or the flag is missing. Always pick the SAFEST option.
// ─────────────────────────────────────────────────────────────

import { OpenFeature, InMemoryProvider } from "@openfeature/react-sdk";
import type { EvaluationContext } from "@openfeature/react-sdk";

/**
 * Flag configuration object.
 *
 * Each flag has:
 *   - disabled: false          → flag is active
 *   - variants: { ... }        → possible return values
 *   - defaultVariant: '...'    → which variant to use when no rule matches
 *   - contextEvaluator (opt)   → function that picks variant based on user context
 *
 * TODO: Uncomment flags one at a time as you build the UI.
 */
const flagConfig = {
	// ── Boolean flags ──────────────────────────────────────
	// showPoints: {
	//   disabled: false,
	//   variants: { on: true, off: false },
	//   defaultVariant: 'off',   // SAFEST: hide points by default
	// },
	// enableBetaSearch: {
	//   disabled: false,
	//   variants: { on: true, off: false },
	//   defaultVariant: 'off',   // SAFEST: beta off for everyone
	//   // TODO (Level 3): Add contextEvaluator to enable only for admins
	//   // contextEvaluator: (ctx: EvaluationContext) => {
	//   //   return ctx.role === 'admin' ? 'on' : 'off';
	//   // },
	// },
	// ── String/variant flags ───────────────────────────────
	// useNewCheckout: {
	//   disabled: false,
	//   variants: { list: 'list', card: 'card' },
	//   defaultVariant: 'list',  // SAFEST: show familiar list view
	// },
	// pricingVariant: {
	//   disabled: false,
	//   variants: { default: 'default', discount: 'discount', premium: 'premium' },
	//   defaultVariant: 'default', // SAFEST: normal pricing
	// },
} as const;

/**
 * Initialize the OpenFeature provider.
 *
 * Call this ONCE before your React tree renders.
 * A good place is at the top of main.tsx or in a separate init module.
 *
 * TODO: Uncomment the line below when you're ready to wire it up.
 */
// OpenFeature.setProvider(new InMemoryProvider(flagConfig));

/**
 * Export the config for debugging / the dev dashboard.
 */
export { flagConfig };

/**
 * Re-export the setProvider call so the caller only imports one function.
 *
 * TODO: Uncomment the body when ready.
 */
export function initFlags() {
	// OpenFeature.setProvider(new InMemoryProvider(flagConfig));
}
