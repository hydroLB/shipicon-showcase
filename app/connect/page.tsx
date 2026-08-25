import Link from 'next/link';

export default function ConnectPage() {
  return (
    <main className="connect-shell">
      <section className="connect-card" aria-labelledby="connect-title">
        <span className="eyebrow">OpenAI connection</span>
        <h1 id="connect-title">Connect in the full app</h1>
        <p>
          The web showcase stays in demo mode. Download ShipIcon to connect OpenAI and use your own projects.
        </p>
        <div className="connect-actions">
          <Link className="secondary-link" href="/">← Back</Link>
          <a
            className="download-button"
            href="https://github.com/hydroLB/shipcon_icon/releases/latest"
            rel="noreferrer"
          >
            Download full app
          </a>
        </div>
      </section>
    </main>
  );
}
