'use client';

import Image from 'next/image';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';

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
] as const;

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function Home() {
  const [projectName, setProjectName] = useState('ShipIcon');
  const [projectReady, setProjectReady] = useState(true);
  const [prompt, setPrompt] = useState('A friendly cargo ship cutting through bright blue waves, bold shape, polished app icon');
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const alive = useRef(true);

  useEffect(() => () => {
    alive.current = false;
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
  }, [sourcePreview]);

  function setProjectFromFiles(files: FileList | File[]) {
    const first = files[0];
    if (!first) return;
    const relativePath = 'webkitRelativePath' in first ? first.webkitRelativePath : '';
    const folder = relativePath.split('/')[0];
    setProjectName(folder || first.name.replace(/\.[^/.]+$/, '') || 'My project');
    setProjectReady(true);
  }

  function chooseProject(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) setProjectFromFiles(event.target.files);
  }

  function dropProject(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) setProjectFromFiles(event.dataTransfer.files);
  }

  function chooseSource(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setSourcePreview(URL.createObjectURL(file));
    setSourceName(file.name);
  }

  async function generate() {
    if (!projectReady || !prompt.trim() || generationState === 'creating') return;
    setGenerationState('creating');
    await wait(1100);
    if (!alive.current) return;
    setSelected((current) => (current + 1) % icons.length);
    setGenerationState('done');
  }

  const selectedIcon = icons[selected];
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
        <p className="kicker">App icons without the busywork</p>
        <h1>Put in a project.<br />Get an icon.</h1>
        <p>Describe a new icon, or add an image and say what to change.</p>
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

          <label
            className={`project-drop ${isDragging ? 'dragging' : ''}`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropProject}
          >
            <input
              type="file"
              multiple
              {...({ webkitdirectory: '' } as Record<string, string>)}
              onChange={chooseProject}
            />
            <span className="folder-symbol" aria-hidden="true">⌁</span>
            <span className="project-copy">
              <strong>{projectReady ? projectName : 'Choose project folder'}</strong>
              <small>{projectReady ? 'Ready for an icon' : 'Drop a folder here or browse'}</small>
            </span>
            <span className="choose-pill">{projectReady ? 'Change' : 'Choose'}</span>
          </label>

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
                disabled={!projectReady || !prompt.trim() || generationState === 'creating'}
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
          <p className="preview-hint">Tap the icon for a closer look</p>

          <div className="library-heading">
            <div><h3>Your icons</h3><p>Select one to refine it.</p></div>
            <span>{icons.length} ideas</span>
          </div>
          <div className="icon-library" aria-label="Generated icon ideas">
            {icons.map((icon, index) => (
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
