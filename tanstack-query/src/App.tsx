const topics = ['QueryClient', 'query keys', 'loading states', 'mutations']

export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">TanStack Query practice scaffold</p>
        <h1>Server-state playground is set up</h1>
        <p className="lead">
          The shell and sample API are ready. Focus on queries, mutations, cache invalidation,
          and lifecycle states.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Prepared for you</h2>
          <ul>
            <li>React + Vite scaffold</li>
            <li>TanStack Query dependency installed</li>
            <li>Sample product API server at port 4002</li>
          </ul>
        </article>

        <article className="card">
          <h2>Your implementation</h2>
          <ul>
            <li>Create the QueryClient setup</li>
            <li>Build one list query</li>
            <li>Add one mutation</li>
            <li>Invalidate or refresh intelligently</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Core topics</h2>
        <div className="pill-row">
          {topics.map((item) => (
            <span className="pill" key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
