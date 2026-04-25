// Direction 4 — COLOPHON (refined)
// Flat translucent scrim over the full video. No masthead.
// Tighter type, content anchored to bottom via flex push so it never
// floats above the viewport when the window is short. Mobile stacks.

const ArtboardColophon = ({ overlay = 'scrim', customOverlay = null }) => {
  const C = window.BRANCHES_CONTENT;

  React.useEffect(() => {
    if (document.getElementById('br-colo-styles')) return;
    const s = document.createElement('style');
    s.id = 'br-colo-styles';
    s.textContent = `
      /* Desktop: flex column, content anchored to bottom, spacer above */
      .colo-scroll {
        display: flex;
        flex-direction: column;
      }
      .colo-spacer { flex: 1 1 auto; min-height: 40vh; }
      .colo-wrap {
        position: relative;
        z-index: 1;
        padding: 0 5vw 56px;
        display: grid;
        grid-template-columns: 1.1fr 1.4fr 1fr;
        gap: 48px;
        align-items: start;
      }
      .colo-intro p { font-size: 12.5px; line-height: 1.35; letter-spacing: -0.008em; margin-bottom: 6px; }
      .colo-intro .reach {
        font-size: 12px; line-height: 1.35; letter-spacing: -0.005em;
        margin-top: 18px; margin-bottom: 10px; color: rgba(44,36,32,0.62);
      }
      .colo-current p, .colo-projline {
        font-size: 12px; line-height: 1.32; letter-spacing: -0.005em; margin-bottom: 2px;
      }
      .colo-offering {
        font-size: 11.5px; line-height: 1.42; letter-spacing: -0.005em;
        margin-bottom: 9px; font-weight: 400;
      }
      .colo-pastrow {
        display: grid; grid-template-columns: 1fr auto; gap: 8px;
        padding: 4px 0;
        font-size: 10.5px; line-height: 1.28; letter-spacing: -0.003em;
      }
      .colo-pastrow + .colo-pastrow { border-top: 1px solid rgba(44,36,32,0.07); }
      .colo-pastmeta { font-size: 9.5px; letter-spacing: 0.02em; color: rgba(44,36,32,0.4); }
      .colo-pastyear { font-size: 10px; color: rgba(44,36,32,0.55); }

      /* Narrow tablet: drop Past to full width, keep two content columns.
         Threshold low enough that most desktop previews keep three cols. */
      @media (max-width: 780px) {
        .colo-wrap {
          grid-template-columns: 1fr 1fr;
          gap: 32px 28px;
          padding: 0 6vw 40px;
        }
        .colo-past-col { grid-column: 1 / -1; }
        .colo-spacer { min-height: 30vh; }
      }

      /* Mobile: single column stack */
      @media (max-width: 560px) {
        .colo-scroll { min-height: 100vh; }
        .colo-spacer { min-height: 44vh; }
        .colo-wrap {
          grid-template-columns: 1fr;
          gap: 56px;
          padding: 0 24px 40px;
        }
        .colo-intro p { font-size: 14px; }
        .colo-intro .reach { font-size: 13px; }
        .colo-current p, .colo-projline { font-size: 13px; }
        .colo-offering { font-size: 12.5px; line-height: 1.5; margin-bottom: 12px; }
        .colo-offerings { margin-top: 56px !important; }
        .colo-pastrow { font-size: 12px; padding: 6px 0; }
        .colo-pastmeta { font-size: 10.5px; }
        .colo-pastyear { font-size: 11px; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="br-root colo-scroll" style={{ minHeight: '100%', overflowY: 'auto' }}>
      <SharedVideoBg overlay="scrim" customOverlay={customOverlay} />
      <div className="colo-spacer" />
      <div className="colo-wrap">
        <div className="colo-intro">
          <p>
            <strong>Branches</strong> is a container for creative projects and consulting work by <a href="https://linkedin.com/in/chrisneels">Chris Neels</a>.
          </p>
          <p>
            An overarching interest is exploring alternative potentials from a place of slowness and deliberation.
          </p>
          <p className="reach">
            If you'd like to learn more or explore working together, please <a href={`mailto:${C.email}`} style={{ color: 'inherit' }}>reach out</a>.
          </p>
          <form
            className="br-substack"
            style={{ marginTop: 4 }}
            action="https://chrisneels.substack.com/subscribe"
            method="get"
            target="_blank"
            rel="noopener"
          >
            <input name="email" type="email" required placeholder="subscribe to notes" autoComplete="email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div>
          <div className="colo-current">
            <div className="br-label" style={{ marginBottom: 8 }}>Current Projects</div>
            {C.current.map((p, i) => (
              <p className="colo-projline" key={i}>
                {p.href ? <a href={p.href} className="name">{p.name}</a> : <span className="name">{p.name}</span>}
                <span>: {p.desc}</span>
              </p>
            ))}
          </div>
          <div className="colo-offerings" style={{ marginTop: 18 }}>
            <div className="br-label" style={{ marginBottom: 8 }}>Offerings</div>
            {C.offerings.map((o, i) => (
              <p className="colo-offering" key={i}>
                <span className="name">{o.name}.</span>{' '}
                <span className="muted">{o.body}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="colo-past-col">
          <div className="br-label" style={{ marginBottom: 8 }}>Past Projects</div>
          {C.past.map((r, i) => (
            <div key={i} className="br-row colo-pastrow">
              <div>
                <div>{r.project}</div>
                <div className="colo-pastmeta">{r.partner} · {r.type}</div>
              </div>
              <div className="colo-pastyear">{r.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.ArtboardColophon = ArtboardColophon;
