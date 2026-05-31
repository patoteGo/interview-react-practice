const steps = [
  'Run the sample API server',
  'Build the UI flow first',
  'Add stable data-testid selectors',
  'Automate the flow in Cypress',
]

export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Cypress practice scaffold</p>
        <h1>User-flow app ready for testing</h1>
        <p className="lead">
          You already have the app shell, sample backend, and Cypress config. Focus on building
          the user flow and then automate it.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Prepared for you</h2>
          <ul>
            <li>React + Vite scaffold</li>
            <li>Sample API server at port 4001</li>
            <li>Cypress config and folder structure</li>
          </ul>
        </article>

        <article className="card">
          <h2>What you implement</h2>
          <ul>
            <li>Todo-style UI flow</li>
            <li>Loading, empty, success, and error UI</li>
            <li>Selectors for robust tests</li>
            <li>E2E specs in Cypress</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Suggested flow</h2>
        <div className="pill-row">
          {steps.map((item) => (
            <span className="pill" key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
