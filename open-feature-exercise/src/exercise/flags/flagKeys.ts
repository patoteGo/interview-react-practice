// ─────────────────────────────────────────────────────────────
// Step 1: Define your flag keys
//
// These are the names of your feature flags. Keep them:
//   - camelCase
//   - descriptive of the BEHAVIOR they control
//   - grouped by type (boolean vs string variants)
//
// The exported object gives you a single source of truth.
// Every component that reads a flag imports from here.
// ─────────────────────────────────────────────────────────────

/**
 * Boolean flags — simple on/off switches.
 *
 * TODO: Uncomment the flags below as you build each feature.
 */
export const BooleanFlags = {
	// showPoints: 'showPoints',         // Show loyalty points column in the feed
	// enableBetaSearch: 'enableBetaSearch', // Show experimental search bar (admin only)
} as const;

/**
 * String variant flags — return one of several named options.
 *
 * TODO: Uncomment when you reach Level 2.
 */
export const StringFlags = {
	// useNewCheckout: 'useNewCheckout', // 'list' | 'card' — controls NewsFeed layout
	// pricingVariant: 'pricingVariant', // 'default' | 'discount' | 'premium'
} as const;

/**
 * Convenience: all flag keys in one array (useful for debugging).
 *
 * TODO: Add your keys here as you uncomment them above.
 */
export const ALL_FLAG_KEYS: readonly string[] = [
	// ...Object.values(BooleanFlags),
	// ...Object.values(StringFlags),
];
