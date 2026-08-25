'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type BuildState = 'ready' | 'building' | 'complete';
type PreviewKind = 'icon' | 'manifest';

const previewSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const buildSteps = [
  [12, 'Scanning sample project…'],
  [34, 'Creating deterministic visual brief…'],
  [62, 'Normalizing source artwork…'],
  [84, 'Encoding PNG, ICO, and ICNS assets…'],
  [100, 'Icons generated.'],
] as const;

const manifest = `{
  "schema_version": 1,
  "app_name": "ShipIcon",
  "source": "demo",
  "network_requests": 0,
  "formats": ["png", "ico", "icns"],
  "status": "complete"
}`;

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function Home() {
  const [buildState, setBuildState] = useState<BuildState>('ready');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready.');
  const [feedback, setFeedback] = useState('Ready.');
  const [appName, setAppName] = useState('ShipIcon');
  const [preview, setPreview] = useState<PreviewKind | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const [logs, setLogs] = useState([
    'SHOWCASE Sample project loaded.',
  ]);
  const alive = useRef(true);

  useEffect(() => () => {
    alive.current = false;
  }, []);

  async function runBuild() {
    if (buildState === 'building') return;
    setBuildState('building');
    setProgress(3);
    setStatus('Preparing build…');
    setFeedback('Generating icon set…');
    setLogs(['INFO shipicon.pipeline: Starting icon generation.']);

    for (const [nextProgress, message] of buildSteps) {
      await sleep(420);
      if (!alive.current) return;
      setProgress(nextProgress);
      setStatus(message);
      setLogs((current) => [...current, `INFO shipicon.pipeline: ${message}`]);
    }

    setBuildState('complete');
    setFeedback('Icon set generated.');
  }

  function resetBuild() {
    setBuildState('ready');
    setProgress(0);
    setStatus('Ready.');
    setFeedback('Ready.');
    setLogs(['SHOWCASE Sample project loaded.']);
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        void runBuild();
      }
      if (event.key === 'Escape') {
        setPreview(null);
        setShowSamples(false);
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const isComplete = buildState === 'complete';

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>ShipIcon</h1>
          <p>Generate production-ready PNG, ICO, and ICNS assets with consistent defaults.</p>
        </div>
        <div className="header-actions">
          <div className="web-badge" title="Using sample data">
            <span aria-hidden="true" /> Demo mode
          </div>
          <Link className="connect-button" href="/connect">Connect OpenAI</Link>
          <a
            className="download-button"
            href="https://github.com/hydroLB/shipcon_icon/releases/latest"
            rel="noreferrer"
          >
            Download full app
          </a>
        </div>
      </header>

      <section className="card setup-card" aria-labelledby="setup-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Step 1</span>
            <h2 id="setup-title">Choose the input</h2>
          </div>
          <button type="button" className="toolbar-button" onClick={() => setShowSamples(true)}>
            Change sample…
          </button>
        </div>

        <div className="setup-grid">
          <div className="setup-item">
            <span>Project</span>
            <strong>ShipIcon sample project</strong>
            <small>Python · desktop utility</small>
          </div>
          <label className="setup-item" htmlFor="app-name">
            <span>App name</span>
            <input
              id="app-name"
              value={appName}
              maxLength={64}
              onChange={(event) => setAppName(event.target.value)}
            />
          </label>
          <button type="button" className="setup-item source-summary" onClick={() => setShowSamples(true)}>
            <Image src="/shipicon-demo-source.png" width={42} height={42} alt="" />
            <span>
              <small>Source artwork</small>
              <strong>Sample artwork</strong>
              <em>Change artwork</em>
            </span>
          </button>
        </div>

        <details className="technical-details">
          <summary>Technical setup</summary>
          <div className="technical-grid">
            <div><span>Project folder</span><code>demo://shipicon-showcase</code></div>
            <div><span>Workspace</span><code>browser-workspace/shipicon-build</code></div>
            <div><span>Source mode</span><code>Existing image · 1 candidate · best</code></div>
            <div><span>Build mode</span><code>Demo</code></div>
          </div>
        </details>

        <p className={`feedback ${isComplete ? 'success' : ''}`} role="status">
          <span aria-hidden="true">●</span> {feedback}
        </p>
      </section>

      <section className="card focus-workspace" aria-label="Icon generation workspace">
        <div className="focus-preview">
          <span className="eyebrow">Live preview</span>
          <button type="button" className="icon-stage" onClick={() => setPreview('icon')}>
            <Image
              src="/shipicon-demo-source.png"
              width={148}
              height={148}
              alt={`${appName || 'ShipIcon'} icon preview`}
              priority
            />
            <span>Open larger preview</span>
          </button>
          <h2>{appName || 'Untitled app'}</h2>
          <p>One source, nine production sizes.</p>

          <details className="size-disclosure">
            <summary>See all export sizes</summary>
            <div className="size-grid">
              {previewSizes.map((size) => (
                <figure key={size}>
                  <div><Image src="/shipicon-demo-source.png" width={32} height={32} alt="" /></div>
                  <figcaption>{size}px</figcaption>
                </figure>
              ))}
            </div>
          </details>
        </div>

        <div className={`action-panel ${buildState}`} aria-live="polite">
          {buildState === 'ready' && (
            <>
              <span className="eyebrow">Step 2</span>
              <h2>Generate the icon set</h2>
              <p>Run the sample workflow and inspect the same outputs the desktop app creates.</p>
              <ul className="trust-list">
                <li><span>1</span> sample project</li>
                <li><span>3</span> production formats</li>
                <li><span>9</span> preview sizes</li>
              </ul>
              <button
                type="button"
                className="primary-button action-primary"
                disabled={!appName.trim()}
                onClick={() => void runBuild()}
              >
                Generate icons
              </button>
              <small>Ctrl/⌘ + Enter</small>
            </>
          )}

          {buildState === 'building' && (
            <>
              <span className="eyebrow">Building</span>
              <div className="working-mark" aria-hidden="true"><span /></div>
              <h2>{status}</h2>
              <p>Building the sample icon set.</p>
              <div
                className="progress-track large"
                role="progressbar"
                aria-label="Build progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <strong className="progress-value">{progress}%</strong>
            </>
          )}

          {buildState === 'complete' && (
            <>
              <span className="eyebrow success-text">Build complete</span>
              <h2>Generated assets</h2>
              <p>Inspect the output structure produced by the demo workflow.</p>
              <div className="result-list">
                {[
                  ['PNG', '1024px RGBA', 'icon'],
                  ['ICO', '7 Windows sizes', 'icon'],
                  ['ICNS', '8 Apple representations', 'icon'],
                  ['Manifest', 'Auditable JSON', 'manifest'],
                ].map(([label, detail, kind]) => (
                  <button type="button" key={label} onClick={() => setPreview(kind as PreviewKind)}>
                    <strong>{label}</strong><span>{detail}</span><em>Preview</em>
                  </button>
                ))}
              </div>
              <div className="complete-actions">
                <button type="button" className="secondary-button" onClick={resetBuild}>Start over</button>
                <a
                  className="download-button"
                  href="https://github.com/hydroLB/shipcon_icon/releases/latest"
                  rel="noreferrer"
                >
                  Get the full app
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      <details className="diagnostics card">
        <summary>Activity details</summary>
        <pre aria-live="polite">{logs.join('\n')}</pre>
      </details>

      {showSamples && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowSamples(false)}>
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="dialog-header">
              <div>
                <span className="eyebrow">Demo mode</span>
                <h2 id="sample-title">Showcase project</h2>
              </div>
              <button type="button" className="close-button" onClick={() => setShowSamples(false)} aria-label="Close">×</button>
            </div>
            <div className="sample-card">
              <Image
                src="/shipicon-demo-source.png"
                width={76}
                height={76}
                alt="ShipIcon sample project artwork"
              />
              <div>
                <strong>ShipIcon sample project</strong>
                <p>A bundled sample project for exploring the workflow.</p>
                <span>Python · Desktop utility · Bundled sample</span>
              </div>
            </div>
            <button type="button" className="primary-button dialog-action" onClick={() => {
              resetBuild();
              setShowSamples(false);
              setFeedback('Sample project selected.');
            }}>Use sample project</button>
          </section>
        </div>
      )}

      {preview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPreview(null)}>
          <section
            className="dialog preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="dialog-header">
              <div>
                <span className="eyebrow">Generated output</span>
                <h2 id="preview-title">{preview === 'manifest' ? 'Build manifest' : `${appName || 'ShipIcon'} icon`}</h2>
              </div>
              <button type="button" className="close-button" onClick={() => setPreview(null)} aria-label="Close">×</button>
            </div>
            {preview === 'manifest' ? (
              <pre className="manifest-preview">{manifest.replace('ShipIcon', appName || 'ShipIcon')}</pre>
            ) : (
              <div className="large-icon-preview">
                <Image
                  src="/shipicon-demo-source.png"
                  width={216}
                  height={216}
                  alt="Generated icon preview"
                />
              </div>
            )}
            <p className="dialog-note">Download the full desktop app to process your own project.</p>
          </section>
        </div>
      )}
    </main>
  );
}
