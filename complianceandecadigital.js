/**
 * Frame Agency — Consent Gate
 * Bottom sheet (mobile) / Centered popup (desktop)
 * Cookie persistence: 2 days
 * Bilíngue PT/EN | LGPD + ECA compliant
 */
(function () {
  'use strict';

  // ─── Cookie helpers ───────────────────────────────────────────────────────────

  const COOKIE_KEY = 'frame_consent_v1';
  const COOKIE_DAYS = 2;

  function setCookie(name, value, days) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${exp};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').some(c => c.startsWith(name + '='));
  }

  if (getCookie(COOKIE_KEY)) return; // Já aceitou nos últimos 2 dias

  // ─── Config ───────────────────────────────────────────────────────────────────

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

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
      --fg-border:      #ebebeb;
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
        padding: 0 0 env(safe-area-inset-bottom, 0);
        box-shadow: var(--fg-shadow);
        transform: translateY(100%);
        transition: transform 0.48s var(--fg-ease-spring);
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
      }
      #fg-drag-handle {
        display: block;
        width: 38px;
        height: 4px;
        background: #d8d8d8;
        border-radius: 99px;
        margin: 14px auto 4px;
      }
      #fg-inner {
        padding: 10px 22px 22px;
      }
    }

    /* ── DESKTOP: Centered Popup ── */
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
        width: min(440px, 92vw);
        box-shadow: var(--fg-shadow);
        transform: translateY(14px) scale(0.97);
        opacity: 0;
        transition:
          transform 0.44s var(--fg-ease-spring),
          opacity   0.38s var(--fg-ease-out);
        will-change: transform, opacity;
        overflow: hidden;
      }
      #fg-overlay.fg-visible #fg-sheet {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      #fg-overlay.fg-dismiss #fg-sheet {
        transform: translateY(10px) scale(0.97);
        opacity: 0;
      }
      #fg-drag-handle { display: none; }
      #fg-inner {
        padding: 28px 28px 24px;
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

    /* ── Title ── */
    #fg-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--fg-text);
      margin: 0 0 18px;
      letter-spacing: -0.3px;
      line-height: 1.25;
    }
    #fg-title span {
      background: linear-gradient(95deg, var(--fg-gold), var(--fg-gold-dark));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Cards ── */
    .fg-card {
      background: #faf9f7;
      border: 1px solid var(--fg-border);
      border-radius: var(--fg-radius-sm);
      margin-bottom: 10px;
      overflow: hidden;
      cursor: pointer;
      transition:
        border-color 0.2s ease,
        background   0.2s ease,
        transform    0.15s ease;
      -webkit-tap-highlight-color: transparent;
      text-decoration: none;
      display: block;
    }
    .fg-card:hover {
      border-color: var(--fg-gold-light);
      background: #fffcf8;
      transform: translateY(-1px);
    }
    .fg-card:active {
      transform: scale(0.99) translateY(0);
      background: #fff8f0;
    }
    .fg-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
    }
    .fg-card-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--fg-gold-light), var(--fg-gold));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .fg-card-icon svg {
      width: 14px;
      height: 14px;
      display: block;
    }
    .fg-card-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--fg-text);
      flex: 1;
    }
    .fg-card-arrow {
      color: #c4c4c4;
      font-size: 15px;
      line-height: 1;
      transition: transform 0.2s ease, color 0.2s ease;
    }
    .fg-card:hover .fg-card-arrow {
      transform: translateX(2px);
      color: var(--fg-gold);
    }
    .fg-card-body {
      font-size: 12.5px;
      color: var(--fg-muted);
      line-height: 1.55;
      padding: 0 14px 12px;
      border-top: 1px solid var(--fg-border);
      margin-top: 0;
    }
    .fg-card-body strong {
      color: var(--fg-text);
      font-weight: 600;
    }

    /* ── Divider ── */
    .fg-divider {
      height: 1px;
      background: var(--fg-border);
      margin: 14px 0;
    }

    /* ── Button ── */
    #fg-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--fg-gold), var(--fg-gold-dark));
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 13px 20px;
      font-family: var(--fg-font);
      font-size: 14.5px;
      font-weight: 700;
      letter-spacing: 0.15px;
      cursor: pointer;
      transition:
        opacity      0.2s ease,
        transform    0.15s ease,
        box-shadow   0.2s ease;
      box-shadow: 0 4px 18px rgba(172, 134, 92, 0.35);
      outline: none;
      position: relative;
      overflow: hidden;
      margin-top: 16px;
    }
    #fg-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0));
      opacity: 0;
      transition: opacity 0.2s;
    }
    #fg-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(172, 134, 92, 0.45);
    }
    #fg-btn:hover::after { opacity: 1; }
    #fg-btn:active {
      transform: scale(0.98) translateY(0);
      box-shadow: 0 2px 10px rgba(172, 134, 92, 0.25);
    }

    /* ── Legal note ── */
    #fg-legal {
      font-size: 10.5px;
      color: #b0b0b0;
      text-align: center;
      line-height: 1.5;
      margin-top: 11px;
    }
    #fg-legal a {
      color: var(--fg-gold);
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.15s;
    }
    #fg-legal a:hover { opacity: 0.75; }

    /* ── Dismiss animation ── */
    #fg-overlay.fg-dismiss {
      opacity: 0;
      pointer-events: none;
    }
  `;

  // ─── HTML ─────────────────────────────────────────────────────────────────────

  const checkSVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const cookieSVG = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5.5" stroke="#ffffff" stroke-width="1.7"/>
    <circle cx="5" cy="6" r="0.9" fill="#ffffff"/>
    <circle cx="8.5" cy="5" r="0.9" fill="#ffffff"/>
    <circle cx="7.5" cy="9" r="0.9" fill="#ffffff"/>
  </svg>`;

  const html = `
    <div id="fg-overlay" role="dialog" aria-modal="true" aria-label="Verificação de Acesso — Frame">
      <div id="fg-sheet">
        <div id="fg-header-stripe"></div>
        <div id="fg-drag-handle"></div>
        <div id="fg-inner">
          <p id="fg-title">Verificação de <span>Acesso</span></p>

          <a href="https://www.frameag.com/termos" target="_blank" rel="noopener noreferrer" class="fg-card">
            <div class="fg-card-header">
              <div class="fg-card-icon">${checkSVG}</div>
              <span class="fg-card-label">Termos de uso do site</span>
              <span class="fg-card-arrow">›</span>
            </div>
            <div class="fg-card-body">
              Ao prosseguir, confirmo ser maior de <strong>18 anos</strong> e aceito os
              <strong>Termos e Condições</strong> da Frame.
            </div>
          </a>

          <a href="https://www.frameag.com/privacy" target="_blank" rel="noopener noreferrer" class="fg-card">
            <div class="fg-card-header">
              <div class="fg-card-icon">${cookieSVG}</div>
              <span class="fg-card-label">Aviso de cookies</span>
              <span class="fg-card-arrow">›</span>
            </div>
            <div class="fg-card-body">
              Usamos <strong>cookies</strong> e tecnologias semelhantes para melhorar
              sua experiência em nosso site.
            </div>
          </a>

          <button id="fg-btn">Aceitar</button>

          <p id="fg-legal">
            Em conformidade com a Lei ECA&nbsp;/ n°&nbsp;15.211, poderemos restringir conteúdos.
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

  // ─── Animate in ──────────────────────────────────────────────────────────────

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
    }, 480);
  }

  document.getElementById('fg-btn').addEventListener('click', dismiss);

  // Tap fora (só desktop) fecha também
  document.getElementById('fg-overlay').addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      if (e.target.id === 'fg-overlay') dismiss();
    }
  });

})();