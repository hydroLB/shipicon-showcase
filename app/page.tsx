'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

type GenerationState = 'idle' | 'creating' | 'done';

const icons = [
  { name: 'Original', src: '/shipicon-demo-source.png' },
  { name: 'Ocean', src: '/shipicon-variation-01.png' },
  { name: 'Night', src: '/shipicon-variation-02.png' },
  { name: 'Simple', src: '/shipicon-variation-03.png' },
  { name: 'Depth', src: '/shipicon-variation-04.png' },
  { name: 'Blueprint', src: '/shipicon-variation-05.png' },
  { name: 'Fresh', src: '/shipicon-variation-06.png' },
  { name: 'Classic', src: '/shipicon-variation-07.png' },
  { name: 'Glass', src: '/shipicon-variation-08.png' },
  { name: 'Pixel', src: '/shipicon-variation-09.png' },
  { name: 'Metal', src: '/shipicon-variation-10.png' },
  { name: 'Current', src: '/shipicon-variation-11.png' },
] as const;

function iconSet(slug: string, original: string, generatedCount: number) {
  return [
    { name: 'Original', src: original },
    ...Array.from({ length: generatedCount }, (_, index) => ({
      name: `Direction ${index + 1}`,
      src: `/${slug}-variation-${String(index + 1).padStart(2, '0')}.png`,
    })),
  ];
}

const demoProjects = [
  {
    name: 'ShipIcon',
    summary: 'Desktop icon utility',
    iconSrc: '/shipicon-demo-source.png',
    prompt: 'A friendly cargo ship cutting through bright blue waves, bold shape, polished app icon',
    icons,
  },
  {
    name: 'Harbor Ops',
    summary: 'Port logistics',
    iconSrc: '/harbor-ops-icon.png',
    prompt: 'A modern harbor control tower overlooking a cargo ship, clean depth, cool blue palette',
    icons: iconSet('harbor-ops', '/harbor-ops-icon.png', 14),
  },
  {
    name: 'Tideglass',
    summary: 'Marine forecast',
    iconSrc: '/tideglass-icon.png',
    prompt: 'A calm teal wave wrapping around a small vessel, soft glass finish, simple silhouette',
    icons: iconSet('tideglass', '/tideglass-icon.png', 14),
  },
  {
    name: 'CargoTrack',
    summary: 'Freight tracking',
    iconSrc: '/cargotrack-icon.png',
    prompt: 'A bright container ship with a clear route line, confident geometry, dark ocean background',
    icons: iconSet('cargotrack', '/cargotrack-icon.png', 14),
  },
  {
    name: 'SignalDeck',
    summary: 'Fleet communications',
    iconSrc: '/signaldeck-variation-01.png',
    prompt: 'A marine signal beacon connecting nearby vessels, crisp radio waves, deep blue and coral accents',
    icons: Array.from({ length: 15 }, (_, index) => ({
      name: `Direction ${index + 1}`,
      src: `/signaldeck-variation-${String(index + 1).padStart(2, '0')}.png`,
    })),
  },
];

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function Home() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [prompt, setPrompt] = useState('A friendly cargo ship cutting through bright blue waves, bold shape, polished app icon');
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const alive = useRef(true);
  const refineField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => {
    alive.current = false;
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
  }, [sourcePreview]);

  function chooseSource(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setSourcePreview(URL.createObjectURL(file));
    setSourceName(file.name);
  }

  async function generate() {
    if (!prompt.trim() || generationState === 'creating') return;
    setGenerationState('creating');
    await wait(1100);
    if (!alive.current) return;
    setSelected((current) => (current + 1) % activeIcons.length);
    setGenerationState('done');
  }

  async function refine() {
    if (!refinePrompt.trim() || isRefining) return;
    setIsRefining(true);
    await wait(800);
    if (!alive.current) return;
    setSelected((current) => (current + 1) % activeIcons.length);
    setRefinePrompt('');
    if (refineField.current) refineField.current.style.height = '';
    setGenerationState('done');
    setIsRefining(false);
  }

  function switchProject(index: number) {
    const project = demoProjects[index];
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setProjectIndex(index);
    setPrompt(project.prompt);
    setSelected(0);
    setGenerationState('idle');
    setRefinePrompt('');
    setSourcePreview(null);
    setSourceName(null);
    setShowProjects(false);
  }

  const currentProject = demoProjects[projectIndex];
  const projectName = currentProject.name;
  const activeIcons = currentProject.icons;
  const selectedIcon = activeIcons[selected] || activeIcons[0];
  const previewSource = sourcePreview || selectedIcon.src;

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ShipIcon home">
          <Image src="/shipicon-demo-source.png" width={34} height={34} alt="" priority />
          <span>ShipIcon</span>
        </a>
        <nav aria-label="Project links">
          <a className="quiet-link" href="https://github.com/hydroLB/shipicon-showcase" target="_blank" rel="noreferrer">GitHub</a>
          <a className="download-link" href="https://github.com/hydroLB/shipcon_icon/releases/latest" rel="noreferrer">Download app</a>
        </nav>
      </header>

      <section className="intro" id="top">
        <h1>Attach your app,<br />create your icon.</h1>
        <a className="intro-download" href="https://github.com/hydroLB/shipcon_icon/releases/latest" rel="noreferrer">
          Download free to use
        </a>
      </section>

      <section className="studio" aria-label="ShipIcon workspace">
        <div className="controls">
          <div className="control-heading">
            <span className="step-number">1</span>
            <div>
              <h2>Your project</h2>
              <p>Choose the folder the icon belongs to.</p>
            </div>
          </div>

          <button type="button" className="project-drop" onClick={() => setShowProjects(true)}>
            <span className="folder-symbol" aria-hidden="true">
              <Image src={currentProject.iconSrc} width={48} height={48} alt="" />
            </span>
            <span className="project-copy">
              <strong>{projectName}</strong>
              <small>{currentProject.summary}</small>
            </span>
            <span className="choose-pill">Change</span>
          </button>

          <div className="divider" />

          <div className="control-heading">
            <span className="step-number">2</span>
            <div>
              <h2>What should it look like?</h2>
              <p>Write naturally. You can refine it again afterward.</p>
            </div>
          </div>

          {sourceName && (
            <div className="source-chip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSource} alt="Selected source" />
              <span><strong>Editing this image</strong><small>{sourceName}</small></span>
              <button type="button" aria-label="Remove source image" onClick={() => {
                if (sourcePreview) URL.revokeObjectURL(sourcePreview);
                setSourcePreview(null);
                setSourceName(null);
              }}>×</button>
            </div>
          )}

          <div className="prompt-box">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              aria-label="Describe your icon"
              placeholder="For example: a calm blue wave, simple, soft lighting, no text"
              rows={5}
            />
            <div className="prompt-actions">
              <label className="image-button">
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseSource} />
                <span aria-hidden="true">＋</span> {sourceName ? 'Change image' : 'Add an image'}
              </label>
              <button
                type="button"
                className="generate-button"
                disabled={!prompt.trim() || generationState === 'creating'}
                onClick={() => void generate()}
              >
                {generationState === 'creating' ? <><span className="spinner" aria-hidden="true" /> Creating…</> : generationState === 'done' ? 'Create another' : 'Create icon'}
              </button>
            </div>
          </div>
        </div>

        <div className="preview-area" aria-live="polite">
          <div className="preview-topline">
            <div>
              <span>Preview</span>
              <strong>{projectName}</strong>
            </div>
            {generationState === 'done' && <span className="ready-badge">Ready</span>}
          </div>

          <button className="hero-icon" type="button" onClick={() => setShowPreview(true)} aria-label="Open large icon preview">
            <Image src={selectedIcon.src} width={280} height={280} alt={`${selectedIcon.name} icon`} priority />
          </button>

          <div className="refine-area">
            <label htmlFor="refine-icon">Refine this icon</label>
            <div className="refine-box">
              <textarea
                ref={refineField}
                id="refine-icon"
                rows={1}
                value={refinePrompt}
                placeholder="Make the waves softer…"
                onChange={(event) => {
                  setRefinePrompt(event.target.value);
                  event.target.style.height = '0px';
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 132)}px`;
                }}
              />
              <button type="button" disabled={!refinePrompt.trim() || isRefining} onClick={() => void refine()}>
                {isRefining ? <span className="spinner" aria-label="Refining" /> : 'Refine'}
              </button>
            </div>
          </div>

          <div className="library-heading">
            <div><h3>Your icons</h3><p>Choose a direction.</p></div>
            <span>{activeIcons.length} {activeIcons.length === 1 ? 'idea' : 'ideas'}</span>
          </div>
          <div className="icon-library" aria-label="Generated icon ideas">
            {activeIcons.map((icon, index) => (
              <button
                type="button"
                key={icon.name}
                className={index === selected ? 'selected' : ''}
                aria-label={`Use ${icon.name} icon`}
                aria-pressed={index === selected}
                onClick={() => {
                  setSelected(index);
                  setGenerationState('done');
                }}
              >
                <Image src={icon.src} width={70} height={70} alt="" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>Want to use your own AI provider and export every size?</p>
        <a href="https://github.com/hydroLB/shipcon_icon/releases/latest" rel="noreferrer">Download ShipIcon</a>
      </footer>

      {showProjects && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowProjects(false)}>
          <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setShowProjects(false)} aria-label="Close project picker">×</button>
            <span className="modal-eyebrow">Switch project</span>
            <h2 id="project-modal-title">Choose another app</h2>
            <p>Four prepared apps are ready to explore.</p>
            <div className="project-options">
              {demoProjects.map((project, index) => index === projectIndex ? null : (
                <button type="button" key={project.name} onClick={() => switchProject(index)}>
                  <Image src={project.iconSrc} width={72} height={72} alt="" />
                  <span><strong>{project.name}</strong><small>{project.summary}</small></span>
                  <em aria-hidden="true">›</em>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {showPreview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowPreview(false)}>
          <section className="preview-modal" role="dialog" aria-modal="true" aria-label="Large icon preview" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setShowPreview(false)} aria-label="Close preview">×</button>
            <Image src={selectedIcon.src} width={560} height={560} alt={`${selectedIcon.name} icon large preview`} />
            <div><strong>{projectName}</strong><span>{selectedIcon.name}</span></div>
          </section>
        </div>
      )}
    </main>
  );
}
