// Shared: video background, overlay options, typography tokens.
// All artboards use these so they feel like one family.

const SharedVideoBg = ({ overlay = 'gradient', flip = false, style, customOverlay = null }) => {
  // overlay: 'gradient' | 'radial' | 'edge' | 'scrim' | 'vignette' | 'topFade' | 'bottomHeavy' | 'paperWash'
  // customOverlay: { style: string, opacity: number, warmth: number } — when set, overrides named overlay
  const overlays = {
    gradient: 'linear-gradient(to right, rgba(240,236,228,0.62) 0%, rgba(240,236,228,0.78) 40%, rgba(240,236,228,0.45) 75%, rgba(240,236,228,0.28) 100%)',
    radial: 'radial-gradient(ellipse 80% 90% at 22% 50%, rgba(240,236,228,0.85) 0%, rgba(240,236,228,0.62) 45%, rgba(240,236,228,0.25) 85%)',
    edge: 'linear-gradient(to right, rgba(240,236,228,0.88) 0%, rgba(240,236,228,0.88) 38%, rgba(240,236,228,0.18) 70%)',
    scrim: 'rgba(235,230,220,0.72)',
  };

  // Build overlay CSS from custom params if provided
  let overlayCss = overlays[overlay] || overlays.scrim;
  if (customOverlay) {
    const { style: oStyle, opacity, warmth } = customOverlay;
    // Warmth 0 = cool grey cream (230,228,222), 1 = warm cream (242,232,212)
    const w = Math.max(0, Math.min(1, warmth));
    const r = Math.round(230 + (242 - 230) * w);
    const g = Math.round(228 + (232 - 228) * w);
    const b = Math.round(222 + (212 - 222) * w);
    const op = Math.max(0, Math.min(1, opacity));
    const rgba = (a) => `rgba(${r},${g},${b},${a})`;
    if (oStyle === 'flat') {
      overlayCss = rgba(op);
    } else if (oStyle === 'topFade') {
      overlayCss = `linear-gradient(to bottom, ${rgba(Math.max(0, op - 0.35))} 0%, ${rgba(op * 0.6)} 35%, ${rgba(op)} 75%, ${rgba(Math.min(1, op + 0.05))} 100%)`;
    } else if (oStyle === 'bottomHeavy') {
      overlayCss = `linear-gradient(to bottom, ${rgba(Math.max(0, op - 0.45))} 0%, ${rgba(op * 0.7)} 45%, ${rgba(op)} 70%, ${rgba(Math.min(1, op + 0.08))} 100%)`;
    } else if (oStyle === 'radialBloom') {
      overlayCss = `radial-gradient(ellipse 90% 80% at 50% 65%, ${rgba(Math.min(1, op + 0.1))} 0%, ${rgba(op)} 45%, ${rgba(Math.max(0, op - 0.25))} 90%)`;
    } else if (oStyle === 'paperWash') {
      // Two-stop warm cream wash — feels more like paper than scrim
      overlayCss = `linear-gradient(180deg, ${rgba(op * 0.85)} 0%, ${rgba(op)} 100%)`;
    } else {
      overlayCss = rgba(op);
    }
  }

  // Auto-rotate when portrait (mobile) so the abstract 16:9 video fills
  // the 9:16 viewport without letterboxing.
  const [portrait, setPortrait] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 640px)');
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update); };
  }, []);
  const isFlipped = flip || portrait;

  // Mount the <video> as raw HTML to mirror the proven plain-HTML setup.
  // React's prop ordering with <video muted autoplay> can let Safari evaluate
  // the autoplay policy before `muted` is on the actual DOM attribute,
  // resulting in a "tap to play" overlay. Inserting the same markup the
  // browser parses directly avoids that race entirely.
  const videoHostRef = React.useRef(null);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const videoStyle = `position:absolute;top:50%;left:50%;` +
    `transform:${isFlipped ? 'translate(-50%,-50%) rotate(90deg) scale(1.2)' : 'translate(-50%,-50%)'};` +
    `min-width:100%;min-height:100%;` +
    `width:${isFlipped ? 'auto' : '100%'};height:${isFlipped ? 'auto' : '100%'};` +
    `object-fit:cover;filter:contrast(1.05) brightness(1.02);pointer-events:none;`;
  const videoHTML = videoFailed ? '' :
    `<video autoplay muted loop playsinline webkit-playsinline="true" ` +
    `preload="auto" poster="img/sketch-poster.jpg" ` +
    `style="${videoStyle}">` +
    `<source src="img/sketch.mp4" type="video/mp4">` +
    `</video>`;
  React.useEffect(() => {
    const host = videoHostRef.current;
    if (!host) return;
    const v = host.querySelector('video');
    if (!v) return;
    const onErr = () => setVideoFailed(true);
    v.addEventListener('error', onErr);
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();
    const userKick = () => tryPlay();
    document.addEventListener('click', userKick, { once: true });
    document.addEventListener('touchstart', userKick, { once: true });
    return () => {
      v.removeEventListener('error', onErr);
      document.removeEventListener('click', userKick);
      document.removeEventListener('touchstart', userKick);
    };
  }, [isFlipped, videoFailed]);

  // fixedBg: when true, video pins to the viewport so content can scroll
  // over it. Needed for the Colophon's mobile stack and any desktop overflow.
  const containerPos = style && style.position === 'absolute' ? 'absolute' : 'fixed';
  return (
    <div style={{
      position: containerPos, inset: 0, overflow: 'hidden',
      background: '#e8e2d6',
      backgroundImage: 'url("img/sketch-poster.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
      ...style,
    }}>
      <div
        ref={videoHostRef}
        style={{ position: 'absolute', inset: 0 }}
        dangerouslySetInnerHTML={{ __html: videoHTML }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: overlayCss,
        pointerEvents: 'none',
      }} />
      {/* Warm paper grain: subtle noise via SVG filter */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        opacity: 0.35,
        mixBlendMode: 'multiply',
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.17  0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }} />
    </div>
  );
};

// Shared CSS injection for artboards
if (typeof document !== 'undefined' && !document.getElementById('branches-shared')) {
  const s = document.createElement('style');
  s.id = 'branches-shared';
  s.textContent = `
    /* Hide Safari/iOS native media UI on the background video so the
       'tap to play' overlay never appears. The video is decorative. */
    video::-webkit-media-controls,
    video::-webkit-media-controls-panel,
    video::-webkit-media-controls-start-playback-button,
    video::-webkit-media-controls-overlay-play-button,
    video::-webkit-media-controls-play-button {
      display: none !important;
      -webkit-appearance: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    .br-root {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #2c2420;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .br-root a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: rgba(44,36,32,0.25);
      text-underline-offset: 2px;
      transition: color 0.18s, text-decoration-color 0.18s;
    }
    .br-root a:hover {
      color: #a03020;
      text-decoration-color: #a03020;
    }
    .br-root strong, .br-root .name { font-weight: 800; }
    .br-root .muted { color: rgba(44,36,32,0.55); }
    .br-root .faint { color: rgba(44,36,32,0.4); }
    .br-label {
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(44,36,32,0.45);
    }
    .br-rule { height: 1px; background: rgba(44,36,32,0.14); width: 100%; }
    .br-rule-soft { height: 1px; background: rgba(44,36,32,0.07); width: 100%; }
    /* Substack placeholder */
    .br-substack form { display: contents; }
    .br-substack {
      border: 1px dashed rgba(44,36,32,0.22);
      padding: 10px 12px;
      display: flex;
      gap: 8px;
      align-items: center;
      border-radius: 2px;
    }
    .br-substack input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font: inherit;
      color: inherit;
      font-size: 11px;
    }
    .br-substack input::placeholder { color: rgba(44,36,32,0.4); }
    .br-substack button {
      background: #2c2420;
      color: #f0ece4;
      border: none;
      font: inherit;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 10px;
      cursor: pointer;
      border-radius: 1px;
    }
    .br-substack button:hover { background: #a03020; }
    /* Project row hover */
    .br-row {
      cursor: default;
      transition: background 0.15s;
    }
    .br-row:hover { background: rgba(44,36,32,0.04); }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { SharedVideoBg });
