import { useState, memo, useMemo, useCallback } from "react";

const categories = ["All", "Hardware", "Audio", "Office", "Gaming"];

const products = Array.from({ length: 1500 }, (_, index) => {
	const category = categories[(index % (categories.length - 1)) + 1];
	return {
		id: `product-${index + 1}`,
		name: `${category} Product ${index + 1}`,
		category,
		price: 20 + (index % 17) * 7,
		rating: 3 + ((index * 13) % 20) / 10,
	};
});

function heavyScore(product, searchTerm) {
	let score = 0;

	for (let index = 0; index < 7000; index += 1) {
		score += Math.sqrt(product.price * product.rating + index);
	}

	if (
		searchTerm &&
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	) {
		score += 5000;
	}

	return score;
}

const ProductCard = memo(function ProductCard({ product, onSave }) {
	console.count(`render:${product.id}`);

	return (
		<article className="product-card">
			<div>
				<h3>{product.name}</h3>
				<p>{product.category}</p>
			</div>
			<div className="meta-row">
				<span>${product.price}</span>
				<span>{product.rating.toFixed(1)} ★</span>
			</div>
			<button onClick={() => onSave(product.id)}>Save</button>
		</article>
	);
})

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [category, setCategory] = useState("All");
	const [savedCount, setSavedCount] = useState(0);
	const [themeClicks, setThemeClicks] = useState(0);

	const visibleProducts = useMemo(() => {
		
		const filtered = products
		.filter((product) => category === "All" || product.category === category)
		.filter((product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()),
		)

		const scored = filtered.map((product) => ({
			product,
			score: heavyScore(product, searchTerm),
		}))

		scored.sort((a, b) => b.score - a.score)
		
		return scored.slice(0, 60).map(({ product }) => product);	
	
	}, [searchTerm, category]) ;


	const averagePrice = 
		visibleProducts.reduce((sum, product) => sum + product.price, 0) /
		Math.max(visibleProducts.length, 1);

  const onSave = useCallback(() => setSavedCount((count) => count + 1), []);

	return (
		<main className="page">
			<div className="shell">
				<div className="toolbar">
					<div>
						<span className="eyebrow">React optimization practice</span>
						<h1>Product discovery grid</h1>
						<p>
							The page becomes janky while typing or clicking unrelated
							controls. Optimize it without changing behavior.
						</p>
					</div>

					<div className="controls">
						<input
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search products"
						/>

						<select
							value={category}
							onChange={(event) => setCategory(event.target.value)}
						>
							{categories.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>

						<button onClick={() => setThemeClicks((count) => count + 1)}>
							Unrelated counter: {themeClicks}
						</button>
					</div>
				</div>

				<div className="stats">
					<span>{visibleProducts.length} visible products</span>
					<span>Average price: ${averagePrice.toFixed(2)}</span>
					<span>Saved: {savedCount}</span>
				</div>

				<section className="grid">
					{visibleProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onSave={onSave}
						/>
					))}
				</section>
			</div>
		</main>
	);
}
