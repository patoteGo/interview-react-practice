// ─────────────────────────────────────────────────────────────
// Exercise Component: NewsFeed
//
// FLAG: useNewCheckout (string variant: 'list' | 'card')
// CONCEPT: Use a flag to switch between two COMPLETELY DIFFERENT
//          layouts — not just hiding/showing a tiny element.
//
// What you'll learn:
//   - useStringFlagValue / useFlag for variant flags
//   - Behavioral branching: same data, different UI shape
//   - Why default matters (fallback to 'list' = safe, familiar)
// ─────────────────────────────────────────────────────────────

// TODO: Import the hook you need
// import { useStringFlagValue } from '@openfeature/react-sdk';
// import { StringFlags } from '../flags/flagKeys';

// Fake data — pretend this came from an API
const posts = [
	{ id: 1, title: "OpenFeature 1.0 released", points: 142, author: "alice" },
	{ id: 2, title: "Feature flags best practices", points: 89, author: "bob" },
	{ id: 3, title: "Progressive delivery guide", points: 56, author: "carol" },
];

export function NewsFeed() {
	// TODO: Read the flag value
	// const layout = useStringFlagValue(StringFlags.useNewCheckout, 'list');

	// FOR NOW: hardcoded so you can see the component
	const layout = "list"; // <-- delete this line and use the flag

	return (
		<section className="card">
			<h2>📰 News Feed</h2>
			<p className="muted">
				Layout: <code>{layout}</code>
			</p>

			{/*
        TODO: Branch on the flag value.
        - 'list' → render a simple <ul> list
        - 'card' → render a card grid layout

        HINT: This is where the BEHAVIOR change happens.
        Same data, completely different visual representation.
      */}

			{/* STARTER: Simple list — replace with flag-driven branching */}
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<strong>{post.title}</strong> — by {post.author}
					</li>
				))}
			</ul>

			{/*
        TODO: Build the card layout and conditionally render it:
        
        {layout === 'card' ? (
          <div className="card-grid">
            {posts.map(post => (
              <article className="card" key={post.id}>
                <h3>{post.title}</h3>
                <p>by {post.author}</p>
              </article>
            ))}
          </div>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post.id}><strong>{post.title}</strong> — by {post.author}</li>
            ))}
          </ul>
        )}
      */}
		</section>
	);
}
