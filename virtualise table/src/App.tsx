const focusAreas = [
  'Viewport math',
  'Overscan decisions',
  'Row positioning',
  'Performance observation',
]

export default function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Virtualisation practice scaffold</p>
        <h1>Large table performance playground</h1>
        <p className="lead">
          The app shell is ready. Your job is to build the virtualization logic inside the
          exercise modules and wire it into this page.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Already prepared</h2>
          <ul>
            <li>React + Vite + TypeScript scaffold</li>
            <li>Styled page and starter route</li>
            <li>Exercise folders for data, math, and UI pieces</li>
          </ul>
        </article>

        <article className="card">
          <h2>Your focus</h2>
          <ul>
            <li>Generate a large dataset</li>
            <li>Compute visible row range</li>
            <li>Render only visible rows</li>
            <li>Keep scrolling smooth</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Focus areas</h2>
        <div className="pill-row">
          {focusAreas.map((item) => (
            <span className="pill" key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
