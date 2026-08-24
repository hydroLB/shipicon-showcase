'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type BuildState = 'ready' | 'building' | 'complete';
type PreviewKind = 'icon' | 'manifest';

const previewSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const buildSteps = [
  [12, 'Scanning synthetic project context…'],
  [34, 'Creating deterministic visual brief…'],
  [62, 'Normalizing source artwork…'],
  [84, 'Encoding PNG, ICO, and ICNS assets…'],
  [100, 'Icons generated.'],
] as const;

const manifest = `{
  "schema_version": 1,
  "app_name": "ShipIcon",
  "source": "synthetic",
  "network_requests": 0,
  "formats": ["png", "ico", "icns"],
  "status": "complete"
}`;

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function PathRow({
  label,
  value,
  action = 'Browse…',
  onAction,
}: {
  label: string;
  value: string;
  action?: string;
  onAction: () => void;
}) {
  return (
    <div className="path-row">
      <label>{label}</label>
      <div className="path-controls">
        <input aria-label={label} value={value} readOnly />
        <button type="button" className="toolbar-button" onClick={onAction}>
          {action}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [buildState, setBuildState] = useState<BuildState>('ready');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready with synthetic project.');
  const [feedback, setFeedback] = useState(
    'Synthetic project loaded. This showcase never connects to AI.',
  );
  const [appName, setAppName] = useState('ShipIcon');
  const [preview, setPreview] = useState<PreviewKind | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const [logs, setLogs] = useState([
    'SHOWCASE Synthetic project context loaded.',
    'PRIVACY No project data has left this browser.',
  ]);
  const alive = useRef(true);

  useEffect(() => () => {
    alive.current = false;
  }, []);

  async function runBuild() {
    if (buildState === 'building') return;
    setBuildState('building');
    setProgress(3);
    setStatus('Preparing synthetic build…');
    setFeedback('Offline showcase build in progress. No network requests are made.');
    setLogs(['INFO shipicon.pipeline: Starting synthetic icon generation.']);

    for (const [nextProgress, message] of buildSteps) {
      await sleep(420);
      if (!alive.current) return;
      setProgress(nextProgress);
      setStatus(message);
      setLogs((current) => [...current, `INFO shipicon.pipeline: ${message}`]);
    }

    setBuildState('complete');
    setFeedback('Icon generation completed successfully using synthetic data.');
  }

  function resetBuild() {
    setBuildState('ready');
    setProgress(0);
    setStatus('Ready with synthetic project.');
    setFeedback('Synthetic project loaded. This showcase never connects to AI.');
    setLogs([
      'SHOWCASE Synthetic project context loaded.',
      'PRIVACY No project data has left this browser.',
    ]);
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
          <div className="web-badge" title="Synthetic data only; no API connection">
            <span aria-hidden="true" /> Web showcase · Offline
          </div>
          <a
            className="download-button"
            href="https://github.com/hydroLB/shipcon_icon/releases/latest"
            rel="noreferrer"
          >
            Download full app
          </a>
        </div>
      </header>

      <fieldset className="card settings-card">
        <legend>Project settings</legend>
        <PathRow
          label="Project folder"
          value="synthetic://shipicon-showcase"
          onAction={() => setShowSamples(true)}
        />
        <PathRow
          label="Output folder"
          value="browser-workspace/shipicon-build"
          onAction={() => setFeedback('The web showcase uses a temporary in-browser workspace.')}
        />
        <div className="field-row">
          <label htmlFor="app-name">App name</label>
          <input
            id="app-name"
            value={appName}
            maxLength={64}
            onChange={(event) => setAppName(event.target.value)}
          />
        </div>
        <div className="inline-row source-row">
          <label htmlFor="source-mode">Source</label>
          <select id="source-mode" defaultValue="existing">
            <option value="existing">Existing image</option>
            <option value="ai" disabled>AI generation — desktop app only</option>
          </select>
          <span className="source-note">AI credentials are never accepted by this website.</span>
        </div>
        <PathRow
          label="Source image"
          value="synthetic-assets/shipicon-demo-source.png"
          action="Choose image…"
          onAction={() => setShowSamples(true)}
        />
        <div className="inline-row candidate-row">
          <strong>Candidates</strong>
          <input aria-label="Candidate count" type="number" value="1" readOnly />
          <strong>Pick</strong>
          <select aria-label="Candidate selection" value="best" disabled>
            <option>best</option>
          </select>
        </div>
        <p className={`feedback ${isComplete ? 'success' : ''}`} role="status">
          {feedback}
        </p>
      </fieldset>

      <section className="workspace-grid">
        <fieldset className="card preview-card">
          <legend>Preview</legend>
          <button className="hero-preview" type="button" onClick={() => setPreview('icon')}>
            <Image
              src="/shipicon-demo-source.png"
              width={74}
              height={74}
              alt={`${appName || 'ShipIcon'} synthetic icon preview`}
              priority
            />
            <span>Open preview</span>
          </button>
          <div className="preview-sizes">
            <h2>Preview sizes</h2>
            <div className="size-grid">
              {previewSizes.map((size) => (
                <figure key={size}>
                  <div><Image src="/shipicon-demo-source.png" width={36} height={36} alt="" /></div>
                  <figcaption>{size}px</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="card assets-card">
          <legend>Generated assets</legend>
          {[
            ['Output folder', 'browser-workspace/shipicon-build', 'icon'],
            ['Manifest', 'shipicon-manifest.json', 'manifest'],
            ['PNG', 'icon.png', 'icon'],
            ['ICO', 'icon.ico', 'icon'],
            ['ICNS', 'icon.icns', 'icon'],
          ].map(([label, value, kind]) => (
            <div className="asset-row" key={label}>
              <label>{label}</label>
              <input aria-label={label} value={isComplete ? value : 'Not generated yet'} readOnly />
              <button
                type="button"
                className="toolbar-button"
                disabled={!isComplete}
                onClick={() => setPreview(kind as PreviewKind)}
              >
                Preview
              </button>
            </div>
          ))}
          <p className="asset-note">
            {isComplete
              ? 'Assets are ready to preview. Product downloads always contain the full desktop application.'
              : 'Generate the synthetic icon set to populate this panel.'}
          </p>
        </fieldset>
      </section>

      <fieldset className="card status-card">
        <legend>Run status</legend>
        <p>{status}</p>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Build progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="actions">
          <span>Shortcut: Ctrl/⌘ + Enter</span>
          {isComplete && (
            <button type="button" className="secondary-button" onClick={resetBuild}>Reset</button>
          )}
          <button
            type="button"
            className="primary-button"
            disabled={buildState === 'building' || !appName.trim()}
            onClick={() => void runBuild()}
          >
            {buildState === 'building' ? 'Generating…' : 'Generate icons'}
          </button>
          <button type="button" className="secondary-button" disabled>Cancel</button>
        </div>
      </fieldset>

      <fieldset className="card log-card">
        <legend>Activity log</legend>
        <pre aria-live="polite">{logs.join('\n')}</pre>
      </fieldset>

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
                <span className="eyebrow">Synthetic data</span>
                <h2 id="sample-title">Showcase project</h2>
              </div>
              <button type="button" className="close-button" onClick={() => setShowSamples(false)} aria-label="Close">×</button>
            </div>
            <div className="sample-card">
              <Image
                src="/shipicon-demo-source.png"
                width={76}
                height={76}
                alt="ShipIcon synthetic project artwork"
              />
              <div>
                <strong>ShipIcon sample project</strong>
                <p>A bundled, non-sensitive project snapshot used only to demonstrate the workflow.</p>
                <span>Python · Desktop utility · 0 network requests</span>
              </div>
            </div>
            <button type="button" className="primary-button dialog-action" onClick={() => {
              resetBuild();
              setShowSamples(false);
              setFeedback('Synthetic ShipIcon project selected.');
            }}>Use synthetic project</button>
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
                  alt="Synthetic generated icon"
                />
              </div>
            )}
            <p className="dialog-note">Synthetic preview only. Download the full desktop app to process your own project.</p>
          </section>
        </div>
      )}
    </main>
  );
}
