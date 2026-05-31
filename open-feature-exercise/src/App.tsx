const flags = ['showPoints', 'useNewCheckout', 'pricingVariant']

export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">OpenFeature practice scaffold</p>
        <h1>Feature-flag playground is ready</h1>
        <p className="lead">
          The shell is ready. Your job is to add a provider, evaluation context, and the
          feature-driven UI behavior.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Already prepared</h2>
          <ul>
            <li>React + Vite scaffold</li>
            <li>OpenFeature dependency installed</li>
            <li>Starter folders for provider and UI modules</li>
          </ul>
        </article>

        <article className="card">
          <h2>Your implementation</h2>
          <ul>
            <li>In-memory provider setup</li>
            <li>2-3 meaningful flags</li>
            <li>Context-aware evaluation</li>
            <li>Behavior changes, not only text changes</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Suggested flags</h2>
        <div className="pill-row">
          {flags.map((item) => (
            <span className="pill" key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
