const states = ['connecting', 'open', 'message', 'close', 'retry']

export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">WebSocket practice scaffold</p>
        <h1>Real-time playground is ready</h1>
        <p className="lead">
          The frontend shell and sample WebSocket server are ready. Focus on the client,
          protocol, connection state, and rendering pushed events.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Prepared for you</h2>
          <ul>
            <li>React + Vite scaffold</li>
            <li>Sample WebSocket server at port 4003</li>
            <li>Starter folders for protocol, client, and UI modules</li>
          </ul>
        </article>

        <article className="card">
          <h2>Your implementation</h2>
          <ul>
            <li>WebSocket client setup</li>
            <li>Connection lifecycle state</li>
            <li>Message parsing and rendering</li>
            <li>Send + receive event flow</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Lifecycle states</h2>
        <div className="pill-row">
          {states.map((item) => (
            <span className="pill" key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
