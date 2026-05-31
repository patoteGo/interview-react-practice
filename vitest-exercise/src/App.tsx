const focusAreas = [
	"Pure function testing",
	"Edge-case thinking",
	"Mocks and spies",
	"Optional React Testing Library follow-up",
];

export default function App() {
	return (
		<main className="page">
			<section className="hero">
				<p className="eyebrow">Vitest practice scaffold</p>
				<h1>Ready for your testing exercise</h1>
				<p className="lead">
					The project setup is done for you. Your job is to implement the
					exercise modules and write the tests described in the markdown guides.
				</p>
			</section>

			<section className="card-grid">
				<article className="card">
					<h2>What is already done</h2>
					<ul>
						<li>React + Vite + TypeScript app scaffold</li>
						<li>Vitest configured with jsdom</li>
						<li>Testing Library installed for optional UI tests</li>
						<li>Guides describing what to build and test</li>
					</ul>
				</article>

				<article className="card">
					<h2>What you still implement</h2>
					<ul>
						<li>Create the actual exercise modules</li>
						<li>Write the Vitest specs yourself</li>
						<li>Cover happy path and edge cases</li>
						<li>Refactor after tests give you confidence</li>
					</ul>
				</article>
			</section>

			<section className="card">
				<h2>Focus areas</h2>
				<div className="pill-row">
					{focusAreas.map((item) => (
						<span className="pill" key={item}>
							{item}
						</span>
					))}
				</div>
			</section>

			<section className="card">
				<h2>Useful commands</h2>
				<pre>
					<code>{`npm install\nnpm run dev\nnpm run test\nnpm run test:watch`}</code>
				</pre>
			</section>
		</main>
	);
}
