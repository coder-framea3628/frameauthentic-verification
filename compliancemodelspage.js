/**
 * Frame Agency — Compliance Gate v4
 * Verificação de Acesso · LGPD + ECA Digital (Lei n° 15.211)
 * Bottom sheet (mobile) / Centered popup (desktop)
 * Aparece a cada visita — sem persistência de cookie
 */
(function () {
  'use strict';

  // ─── Font (injetada no <head> antes do CSS para evitar FOUT/reflow) ────────────

  if (!document.getElementById('fr-font-link')) {
    const link = document.createElement('link');
    link.id   = 'fr-font-link';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const css = `
    :root {
      --fr-bronze:       #AC865C;
      --fr-bronze-md:    #8b6d4d;
      --fr-bronze-light: #c9a97e;
      --fr-bronze-glow:  rgba(172, 134, 92, 0.22);
      --fr-bg:           #ffffff;
      --fr-bg-soft:      #faf9f7;
      --fr-text:         #1a1a1a;
      --fr-muted:        #6b6b6b;
      --fr-border:       #e0dbd4;
      --fr-overlay:      rgba(10, 8, 6, 0.48);
      --fr-radius-lg:    20px;
      --fr-radius-md:    12px;
      --fr-font:         'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      --fr-shadow:
        0 2px 4px rgba(0,0,0,0.04),
        0 12px 32px rgba(0,0,0,0.12),
        0 32px 64px rgba(0,0,0,0.08);
      --fr-ease-spring:  cubic-bezier(0.16, 1, 0.3, 1);
      --fr-ease-out:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    #fr-overlay {
      position: fixed;
      inset: 0;
      background: var(--fr-overlay);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 2147483640;
      opacity: 0;
      transition: opacity 0.38s var(--fr-ease-out);
      -webkit-tap-highlight-color: transparent;
      font-family: var(--fr-font);
    }
    #fr-overlay.fr-visible { opacity: 1; }
    #fr-overlay * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── MOBILE: Bottom Sheet ── */
    @media (max-width: 768px) {
      #fr-sheet {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        background: var(--fr-bg);
        border-radius: var(--fr-radius-lg) var(--fr-radius-lg) 0 0;
        padding: 0 0 env(safe-area-inset-bottom, 16px);
        box-shadow: var(--fr-shadow);
        transform: translateY(100%);
        transition: transform 0.52s var(--fr-ease-spring) 0.18s;
        will-change: transform;
        max-height: 92vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      #fr-overlay.fr-visible #fr-sheet  { transform: translateY(0); }
      #fr-overlay.fr-dismiss #fr-sheet  {
        transform: translateY(100%);
        transition: transform 0.34s var(--fr-ease-out) 0s;
      }
      #fr-drag-handle {
        display: block;
        width: 36px;
        height: 4px;
        background: #d8d3cc;
        border-radius: 99px;
        margin: 12px auto 4px;
      }
      #fr-inner { padding: 10px 20px 28px; }
    }

    /* ── DESKTOP: Centered Popup ── */
    @media (min-width: 769px) {
      #fr-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #fr-sheet {
        position: relative;
        background: var(--fr-bg);
        border-radius: var(--fr-radius-lg);
        width: min(420px, 92vw);
        box-shadow: var(--fr-shadow);
        opacity: 0;
        transform: translateY(8px) scale(0.984);
        transition:
          opacity   0.38s var(--fr-ease-out) 0.08s,
          transform 0.42s var(--fr-ease-spring) 0.08s;
        will-change: opacity, transform;
        overflow: hidden;
      }
      #fr-overlay.fr-visible #fr-sheet {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      #fr-overlay.fr-dismiss #fr-sheet {
        opacity: 0;
        transform: translateY(4px) scale(0.99);
        transition:
          opacity   0.22s var(--fr-ease-out) 0s,
          transform 0.22s var(--fr-ease-out) 0s;
      }
      #fr-drag-handle { display: none; }
      #fr-inner { padding: 24px 24px 20px; }
    }

    /* ── Dismiss ── */
    #fr-overlay.fr-dismiss {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.32s var(--fr-ease-out) 0.14s;
    }

    /* ── Header stripe ── */
    #fr-header-stripe {
      height: 3px;
      background: linear-gradient(90deg, var(--fr-bronze), var(--fr-bronze-light), var(--fr-bronze));
      background-size: 200% 100%;
      animation: fr-shimmer 2.8s ease infinite;
    }
    @keyframes fr-shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* ── Título ── */
    #fr-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--fr-text);
      margin: 0 0 14px;
      letter-spacing: -0.2px;
      line-height: 1.25;
      text-align: center;
    }

    /* ── Divisor ── */
    .fr-divider {
      height: 1px;
      background: var(--fr-border);
      margin: 0 0 14px;
    }

    /* ── Blocos de conteúdo ── */
    .fr-block {
      background: var(--fr-bg-soft);
      border: 1px solid var(--fr-border);
      border-radius: var(--fr-radius-md);
      padding: 12px 14px;
      margin-bottom: 9px;
    }
    .fr-block-label {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--fr-bronze);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 6px;
    }
    .fr-block-body {
      font-size: 12.5px;
      color: var(--fr-muted);
      line-height: 1.6;
    }
    .fr-block-body strong {
      color: var(--fr-text);
      font-weight: 600;
    }
    .fr-block-body a {
      color: var(--fr-bronze);
      font-weight: 500;
      text-decoration: underline;
      transition: opacity 0.15s;
    }
    .fr-block-body a:hover { opacity: 0.72; }

    /* ── Linha de privacidade ── */
    #fr-privacy-line {
      font-size: 11.5px;
      color: var(--fr-muted);
      margin: 13px 0 0;
      line-height: 1.4;
    }
    #fr-privacy-line a {
      color: var(--fr-bronze);
      font-weight: 500;
      text-decoration: underline;
      transition: opacity 0.15s;
    }
    #fr-privacy-line a:hover { opacity: 0.72; }

    /* ── Botão ── */
    #fr-btn {
      display: block;
      width: 100%;
      background: var(--fr-bronze);
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 13px 20px;
      font-family: var(--fr-font);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1px;
      cursor: pointer;
      transition:
        background 0.2s ease,
        box-shadow 0.2s ease,
        transform  0.12s ease;
      box-shadow: 0 4px 16px var(--fr-bronze-glow);
      outline: none;
      margin-top: 16px;
    }
    #fr-btn:hover {
      background: var(--fr-bronze-md);
      box-shadow: 0 6px 20px var(--fr-bronze-glow);
    }
    #fr-btn:active {
      background: #7a5c3e;
      transform: scale(0.985);
      box-shadow: 0 2px 8px var(--fr-bronze-glow);
    }

    /* ── Nota legal ── */
    #fr-legal {
      font-size: 10px;
      color: #b8b5b0;
      text-align: center;
      line-height: 1.55;
      margin-top: 10px;
    }
    #fr-legal a {
      color: var(--fr-bronze);
      text-decoration: underline;
      font-weight: 500;
      transition: opacity 0.15s;
    }
    #fr-legal a:hover { opacity: 0.72; }
  `;

  // ─── HTML ─────────────────────────────────────────────────────────────────────

  const html = `
    <div id="fr-overlay" role="dialog" aria-modal="true" aria-label="Verificação de Acesso — Frame">
      <div id="fr-sheet">
        <div id="fr-header-stripe"></div>
        <div id="fr-drag-handle"></div>
        <div id="fr-inner">

          <p id="fr-title">Verificação de Acesso</p>
          <div class="fr-divider"></div>

          <div class="fr-block">
            <p class="fr-block-label">Confirmação de Idade e Termos</p>
            <p class="fr-block-body">
              Ao prosseguir, confirmo ser <strong>maior de 18 anos</strong> e aceito os
              <a href="https://www.frameag.com/termos" target="_blank" rel="noopener noreferrer">Termos e Condições</a>
              da Frame Agency.
            </p>
          </div>

          <div class="fr-block">
            <p class="fr-block-label">Segurança e Verificação</p>
            <p class="fr-block-body">
              As modelos aqui apresentadas foram devidamente <strong>verificadas em 3 etapas</strong>.
              <a href="https://www.frameag.com/verificacao" target="_blank" rel="noopener noreferrer">Saiba mais</a>.
              Caso encontre uso indevido de imagem ou conteúdo ilegal,
              <a href="https://www.frameag.com/report" target="_blank" rel="noopener noreferrer">reporte aqui</a>.
            </p>
          </div>

          <p id="fr-privacy-line">
            Priorizamos sua privacidade e segurança.
            <a href="https://www.frameag.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
          </p>

          <button id="fr-btn">Confirmo, prosseguir</button>

          <p id="fr-legal">
            Em conformidade com a Lei ECA Digital&nbsp;/ n°&nbsp;15.211.
            <a href="https://www.frameag.com/blog/o-que-muda-com-a-nova-lei-felca-eca-digital-para-plataformas"
               target="_blank" rel="noopener noreferrer">Saiba mais</a>
          </p>

        </div>
      </div>
    </div>
  `;

  // ─── Inject ───────────────────────────────────────────────────────────────────

  const styleEl = document.createElement('style');
  styleEl.id = 'fr-compliance-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  document.body.appendChild(wrapper.firstElementChild);

  // ─── Animate in ───────────────────────────────────────────────────────────────

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('fr-overlay').classList.add('fr-visible');
    });
  });

  // ─── Dismiss ─────────────────────────────────────────────────────────────────

  function dismiss() {
    const overlay = document.getElementById('fr-overlay');
    if (!overlay) return;
    overlay.classList.remove('fr-visible');
    overlay.classList.add('fr-dismiss');
    setTimeout(() => {
      overlay.remove();
      document.getElementById('fr-compliance-styles')?.remove();
    }, 460);
  }

  document.getElementById('fr-btn').addEventListener('click', dismiss);

  // Clique fora fecha no desktop
  document.getElementById('fr-overlay').addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      if (e.target.id === 'fr-overlay') dismiss();
    }
  });

})();