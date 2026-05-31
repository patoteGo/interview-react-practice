// ─────────────────────────────────────────────────────────────
// Exercise App — Your playground
//
// This is the main page. Components are rendered here so you
// can see the effect of your flags in real time.
//
// Start with ALL components visible (no flags wired).
// As you wire flags, the components will react automatically.
// ─────────────────────────────────────────────────────────────

import { FlagDashboard } from "./exercise/components/FlagDashboard";
import { NewsFeed } from "./exercise/components/NewsFeed";
import { PointsColumn } from "./exercise/components/PointsColumn";
import { BetaSearch } from "./exercise/components/BetaSearch";
import { PricingCard } from "./exercise/components/PricingCard";

export default function App() {
	return (
		<main className="page">
			<section className="hero">
				<p className="eyebrow">OpenFeature Exercise</p>
				<h1>Feature Flag Playground</h1>
				<p className="lead">
					Wire up the flags in{" "}
					<code>src/exercise/provider/createFlagsProvider.ts</code> and watch
					components change behavior in real time.
				</p>
			</section>

			<FlagDashboard />

			<div className="card-grid">
				<NewsFeed />
				<PointsColumn />
			</div>

			<BetaSearch />
			<PricingCard />
		</main>
	);
}
