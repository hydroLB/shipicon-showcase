'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type BuildState = 'ready' | 'building' | 'complete';

const previewSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const candidates = [
  { name: 'Original', src: '/shipicon-demo-source.png' },
  { name: 'Flat', src: '/shipicon-variation-01.png' },
  { name: 'Neon', src: '/shipicon-variation-02.png' },
  { name: 'Minimal', src: '/shipicon-variation-03.png' },
  { name: 'Isometric', src: '/shipicon-variation-04.png' },
  { name: 'Blueprint', src: '/shipicon-variation-05.png' },
  { name: 'Eco', src: '/shipicon-variation-06.png' },
  { name: 'Retro', src: '/shipicon-variation-07.png' },
  { name: 'Glass', src: '/shipicon-variation-08.png' },
  { name: 'Pixel', src: '/shipicon-variation-09.png' },
  { name: 'Metal', src: '/shipicon-variation-10.png' },
] as const;
const buildSteps = [
  [12, 'Scanning sample project…'],
  [34, 'Creating deterministic visual brief…'],
  [62, 'Normalizing source artwork…'],
  [84, 'Encoding PNG, ICO, and ICNS assets…'],
  [100, 'Icons generated.'],
] as const;

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function Home() {
  const [buildState, setBuildState] = useState<BuildState>('ready');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready.');
  const [feedback, setFeedback] = useState('Ready.');
  const [appName, setAppName] = useState('ShipIcon');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
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
    setSelectedCandidate(1);
    setFeedback('Icon set generated.');
  }

  function resetBuild() {
    setBuildState('ready');
    setProgress(0);
    setSelectedCandidate(0);
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
        setShowPreview(false);
        setShowSamples(false);
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const isComplete = buildState === 'complete';
  const selectedIcon = candidates[selectedCandidate];

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>ShipIcon</h1>
          <p>Generate production-ready PNG, ICO, and ICNS assets with consistent defaults.</p>
        </div>
        <div className="header-actions">
          <div className="web-badge" title="Interactive product showcase">
            <span aria-hidden="true" /> Web showcase
          </div>
          <a
            className="github-button"
            href="https://github.com/hydroLB/shipcon_icon"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
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
            <div><span>Project folder</span><code>showcase://shipicon</code></div>
            <div><span>Workspace</span><code>browser-workspace/shipicon-build</code></div>
            <div><span>Source mode</span><code>Existing image · 1 candidate · best</code></div>
            <div><span>Build mode</span><code>Browser showcase</code></div>
          </div>
        </details>

        <p className={`feedback ${isComplete ? 'success' : ''}`} role="status">
          <span aria-hidden="true">●</span> {feedback}
        </p>
      </section>

      <section className="card focus-workspace" aria-label="Icon generation workspace">
        <div className="focus-preview">
          <span className="eyebrow">Live preview</span>
          <button type="button" className="icon-stage" onClick={() => setShowPreview(true)}>
            <Image
              src={selectedIcon.src}
              width={148}
              height={148}
              alt={`${appName || 'ShipIcon'} ${selectedIcon.name.toLowerCase()} icon preview`}
              priority
            />
            <span>Open larger preview</span>
          </button>
          <h2>{appName || 'Untitled app'}</h2>
          <p>One source, nine production sizes.</p>

          {isComplete && (
            <section className="candidate-picker" aria-labelledby="candidate-title">
              <div className="candidate-heading">
                <strong id="candidate-title">Choose a variation</strong>
                <span>{selectedCandidate + 1} of {candidates.length}</span>
              </div>
              <div className="candidate-strip">
                {candidates.map((candidate, index) => (
                  <button
                    type="button"
                    className={index === selectedCandidate ? 'selected' : ''}
                    key={candidate.name}
                    aria-pressed={index === selectedCandidate}
                    onClick={() => setSelectedCandidate(index)}
                  >
                    <Image src={candidate.src} width={58} height={58} alt="" />
                    <span>{candidate.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <details className="size-disclosure">
            <summary>See all export sizes</summary>
            <div className="size-grid">
              {previewSizes.map((size) => (
                <figure key={size}>
                  <div><Image src={selectedIcon.src} width={32} height={32} alt="" /></div>
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
              <h2>{selectedIcon.name} selected</h2>
              <p>Compare the generated candidates, then keep the direction you prefer.</p>
              <div className="result-summary" aria-label="Generated formats">
                <span><strong>PNG</strong> 1024px RGBA</span>
                <span><strong>ICO</strong> Windows</span>
                <span><strong>ICNS</strong> macOS</span>
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
                <span className="eyebrow">Sample project</span>
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

      {showPreview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowPreview(false)}>
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
                <h2 id="preview-title">{appName || 'ShipIcon'} · {selectedIcon.name}</h2>
              </div>
              <button type="button" className="close-button" onClick={() => setShowPreview(false)} aria-label="Close">×</button>
            </div>
            <div className="large-icon-preview">
              <Image
                src={selectedIcon.src}
                width={384}
                height={384}
                alt={`${selectedIcon.name} generated icon preview`}
              />
            </div>
            <p className="dialog-note">Download the full desktop app to process your own project.</p>
          </section>
        </div>
      )}
    </main>
  );
}
