/**
 * Frame Agency — Consent Gate v2
 * Bottom sheet (mobile) / Centered popup (desktop)
 * Cookie persistence: 2 days | LGPD + ECA compliant
 */
(function () {
  'use strict';

  // ─── Cookie helpers ───────────────────────────────────────────────────────────

  const COOKIE_KEY  = 'frame_consent_v1';
  const COOKIE_DAYS = 2;

  function setCookie(name, value, days) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${exp};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').some(c => c.startsWith(name + '='));
  }

  if (getCookie(COOKIE_KEY)) return;

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    :root {
      --fg-gold:        #AC865C;
      --fg-gold-dark:   #8b6d4d;
      --fg-gold-light:  #c9a97e;
      --fg-bg:          #ffffff;
      --fg-text:        #1a1a1a;
      --fg-muted:       #6b6b6b;
      --fg-border:      #d8d8d8;
      --fg-overlay:     rgba(10, 8, 6, 0.45);
      --fg-radius-lg:   20px;
      --fg-radius-sm:   12px;
      --fg-font:        'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      --fg-shadow:
        0 2px 4px rgba(0,0,0,0.04),
        0 12px 32px rgba(0,0,0,0.12),
        0 32px 64px rgba(0,0,0,0.08);
      --fg-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --fg-ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    #fg-overlay {
      position: fixed;
      inset: 0;
      background: var(--fg-overlay);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2147483640;
      opacity: 0;
      transition: opacity 0.38s var(--fg-ease-out);
      -webkit-tap-highlight-color: transparent;
      font-family: var(--fg-font);
    }
    #fg-overlay.fg-visible { opacity: 1; }
    #fg-overlay * { box-sizing: border-box; }

    /* ── MOBILE: Bottom Sheet ── */
    @media (max-width: 768px) {
      #fg-sheet {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        background: var(--fg-bg);
        border-radius: var(--fg-radius-lg) var(--fg-radius-lg) 0 0;
        padding: 0 0 env(safe-area-inset-bottom, 12px);
        box-shadow: var(--fg-shadow);
        transform: translateY(100%);
        /* sheet sobe APÓS overlay aparecer — 180ms de delay elegante */
        transition: transform 0.52s var(--fg-ease-spring) 0.18s;
        will-change: transform;
        overflow: hidden;
        max-height: 92vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      #fg-overlay.fg-visible #fg-sheet {
        transform: translateY(0);
      }
      #fg-overlay.fg-dismiss #fg-sheet {
        transform: translateY(100%);
        transition: transform 0.36s var(--fg-ease-out) 0s;
      }
      #fg-drag-handle {
        display: block;
        width: 36px;
        height: 4px;
        background: #d0d0d0;
        border-radius: 99px;
        margin: 12px auto 2px;
      }
      #fg-inner {
        padding: 10px 20px 24px;
      }
    }

    /* ── DESKTOP: Centered Popup — fade in/out apenas ── */
    @media (min-width: 769px) {
      #fg-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #fg-sheet {
        position: relative;
        background: var(--fg-bg);
        border-radius: var(--fg-radius-lg);
        width: min(420px, 92vw);
        box-shadow: var(--fg-shadow);
        opacity: 0;
        transition: opacity 0.40s var(--fg-ease-out) 0.08s;
        will-change: opacity;
        overflow: hidden;
      }
      #fg-overlay.fg-visible #fg-sheet {
        opacity: 1;
      }
      #fg-overlay.fg-dismiss #fg-sheet {
        opacity: 0;
        transition: opacity 0.26s var(--fg-ease-out) 0s;
      }
      #fg-drag-handle { display: none; }
      #fg-inner {
        padding: 24px 24px 20px;
      }
    }

    /* ── Header stripe ── */
    #fg-header-stripe {
      height: 3px;
      background: linear-gradient(90deg, var(--fg-gold), var(--fg-gold-light), var(--fg-gold));
      background-size: 200% 100%;
      animation: fg-shimmer 2.8s ease infinite;
    }
    @keyframes fg-shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* ── Title — preto, centralizado, sem gradiente ── */
    #fg-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--fg-text);
      margin: 0 0 14px;
      letter-spacing: -0.2px;
      line-height: 1.25;
      text-align: center;
    }

    /* ── Cards ── */
    .fg-card {
      background: #faf9f7;
      border: 1px solid var(--fg-border);
      border-radius: var(--fg-radius-sm);
      margin-bottom: 8px;
      overflow: hidden;
      cursor: pointer;
      /* apenas cor muda no hover — sem transform/scale */
      transition:
        border-color 0.22s ease,
        background   0.22s ease;
      -webkit-tap-highlight-color: transparent;
      text-decoration: none;
      display: block;
    }
    .fg-card:hover {
      border-color: var(--fg-gold-light);
      background: #fffdf9;
    }
    .fg-card:active {
      background: #fff8f0;
    }
    .fg-card-header {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 10px 12px;
    }
    .fg-card-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--fg-gold-light), var(--fg-gold));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .fg-card-icon svg {
      width: 12px;
      height: 12px;
      display: block;
    }
    .fg-card-label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--fg-text);
      flex: 1;
    }
    /* Seta maior e mais visível */
    .fg-card-arrow {
      color: #999999;
      font-size: 20px;
      line-height: 1;
      font-weight: 300;
      transition: color 0.2s ease;
    }
    .fg-card:hover .fg-card-arrow {
      color: var(--fg-gold);
    }
    /* Linha separadora com mais contraste + gap generoso */
    .fg-card-body {
      font-size: 12px;
      color: var(--fg-muted);
      line-height: 1.55;
      padding: 9px 12px 11px;
      border-top: 1px solid #cacaca;
    }
    /* Destaque medium (500) nos trechos importantes */
    .fg-card-body em {
      font-style: normal;
      font-weight: 500;
      color: var(--fg-text);
    }

    /* ── Linha de privacidade (acima do botão, alinhada à esquerda) ── */
    #fg-privacy-line {
      font-size: 11.5px;
      color: var(--fg-muted);
      text-align: left;
      margin: 13px 0 0;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #fg-privacy-line a {
      color: var(--fg-gold);
      text-decoration: underline;
      font-weight: 500;
      transition: opacity 0.15s;
    }
    #fg-privacy-line a:hover { opacity: 0.72; }

    /* ── Botão — cor sólida, sem gradiente ── */
    #fg-btn {
      width: 100%;
      background: var(--fg-gold);
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      font-family: var(--fg-font);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1px;
      cursor: pointer;
      transition:
        background  0.2s ease,
        box-shadow  0.2s ease;
      box-shadow: 0 3px 14px rgba(172, 134, 92, 0.28);
      outline: none;
      margin-top: 14px;
    }
    #fg-btn:hover {
      background: var(--fg-gold-dark);
      box-shadow: 0 5px 18px rgba(172, 134, 92, 0.36);
    }
    #fg-btn:active {
      background: #7a5c3e;
      box-shadow: 0 2px 8px rgba(172, 134, 92, 0.18);
    }

    /* ── Nota legal (ECA) ── */
    #fg-legal {
      font-size: 10px;
      color: #b8b8b8;
      text-align: center;
      line-height: 1.5;
      margin-top: 10px;
    }
    #fg-legal a {
      color: var(--fg-gold);
      text-decoration: underline;
      font-weight: 500;
      transition: opacity 0.15s;
    }
    #fg-legal a:hover { opacity: 0.72; }

    /* ── Dismiss ── */
    #fg-overlay.fg-dismiss {
      opacity: 0;
      pointer-events: none;
    }
  `;

  // ─── SVGs ─────────────────────────────────────────────────────────────────────

  const checkSVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const cookieSVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5.5" stroke="#ffffff" stroke-width="1.7"/>
    <circle cx="5" cy="6" r="0.95" fill="#ffffff"/>
    <circle cx="8.5" cy="5" r="0.95" fill="#ffffff"/>
    <circle cx="7.5" cy="9" r="0.95" fill="#ffffff"/>
  </svg>`;

  // ─── HTML ─────────────────────────────────────────────────────────────────────

  const html = `
    <div id="fg-overlay" role="dialog" aria-modal="true" aria-label="Verificação de Acesso — Frame">
      <div id="fg-sheet">
        <div id="fg-header-stripe"></div>
        <div id="fg-drag-handle"></div>
        <div id="fg-inner">

          <p id="fg-title">Verificação de Acesso</p>

          <a href="https://www.frameag.com/termos" target="_blank" rel="noopener noreferrer" class="fg-card">
            <div class="fg-card-header">
              <div class="fg-card-icon">${checkSVG}</div>
              <span class="fg-card-label">Termos de uso do site</span>
              <span class="fg-card-arrow">›</span>
            </div>
            <div class="fg-card-body">
              Ao prosseguir, confirmo ser <em>maior de 18 anos</em> e aceito os
              Termos e Condições da Frame.
            </div>
          </a>

          <a href="https://www.frameag.com/privacy" target="_blank" rel="noopener noreferrer" class="fg-card">
            <div class="fg-card-header">
              <div class="fg-card-icon">${cookieSVG}</div>
              <span class="fg-card-label">Aviso de cookies</span>
              <span class="fg-card-arrow">›</span>
            </div>
            <div class="fg-card-body">
              Usamos <em>cookies e tecnologias</em> semelhantes para melhorar
              sua experiência em nosso site.
            </div>
          </a>

          <p id="fg-privacy-line">Priorizamos sua privacidade e segurança. <a href="https://www.frameag.com/privacy" target="_blank" rel="noopener noreferrer">Entenda</a></p>

          <button id="fg-btn">Concordo</button>

          <p id="fg-legal">
            Em conformidade com a Lei ECA&nbsp;/ n°&nbsp;15.211, poderemos restringir conteúdos antes de verificar sua idade.
            <a href="https://www.frameag.com/blog/o-que-muda-com-a-nova-lei-felca-eca-digital-para-plataformas"
               target="_blank" rel="noopener noreferrer">Saiba mais</a>
          </p>

        </div>
      </div>
    </div>
  `;

  // ─── Inject ───────────────────────────────────────────────────────────────────

  const styleEl = document.createElement('style');
  styleEl.id = 'fg-consent-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild);

  // ─── Animate in ───────────────────────────────────────────────────────────────
  // Overlay aparece → depois (via CSS transition-delay) sheet sobe/faz fade

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('fg-overlay').classList.add('fg-visible');
    });
  });

  // ─── Dismiss ─────────────────────────────────────────────────────────────────

  function dismiss() {
    const overlay = document.getElementById('fg-overlay');
    if (!overlay) return;
    setCookie(COOKIE_KEY, '1', COOKIE_DAYS);
    overlay.classList.remove('fg-visible');
    overlay.classList.add('fg-dismiss');
    setTimeout(() => {
      overlay.remove();
      document.getElementById('fg-consent-styles')?.remove();
    }, 420);
  }

  document.getElementById('fg-btn').addEventListener('click', dismiss);

  // Click fora fecha no desktop
  document.getElementById('fg-overlay').addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      if (e.target.id === 'fg-overlay') dismiss();
    }
  });

})();