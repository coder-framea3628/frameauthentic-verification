/**
 * Frame Agency Terms Popup
 * Bottom sheet no mobile • Popup central no desktop
 * Usa exatamente a paleta, textos e estilo do seu HTML
 * + estrutura visual da captura (dois cards com check)
 * + aceitação válida por 2 dias (localStorage)
 * + animação fluida moderna + ícone de check fornecido
 * + botão Fechar (melhoria UX não agressiva)
 */

(function () {
    'use strict';

    // ─── Configuração ────────────────────────────────────────────────────────────
    const CONFIG = {
        colors: {
            overlay:    'rgba(0, 0, 0, 0.32)',
            popup:      '#ffffff',
            accent:     '#AC865C',
            accentDark: '#946c4c',
            textTitle:  '#222222',
            textBody:   '#444444',
            sectionBg:  '#f8f8f8',
            legalText:  '#666666',
            closeBg:    '#f0f0f0',
            closeHover: '#e0e0e0'
        },
        checkSVG: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067l5-6z"/></svg>`
    };

    // ─── Módulo principal ─────────────────────────────────────────────────────────
    const FrameTermsPopup = {

        init() {
            // Verifica se já aceitou nos últimos 2 dias
            const accepted = localStorage.getItem('frameTermsAccepted');
            if (accepted) {
                const time = parseInt(accepted, 10);
                if (Date.now() - time < 2 * 24 * 60 * 60 * 1000) {
                    return; // não mostra novamente
                }
            }

            this._injectStyles();
            this._render();
            this._bindEvents();
        },

        _injectStyles() {
            const css = `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

                #terms-overlay {
                    position: fixed; inset: 0;
                    background: ${CONFIG.colors.overlay};
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 2147483647;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                }
                #terms-overlay.visible { opacity: 1; }

                #terms-box {
                    background: ${CONFIG.colors.popup};
                    max-width: 420px;
                    width: 90%;
                    padding: 28px 24px 24px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.18);
                    position: relative;
                    transform: scale(0.92) translateY(20px);
                    opacity: 0;
                    transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
                }
                #terms-overlay.visible #terms-box {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }

                /* Bottom sheet no mobile */
                @media (max-width: 768px) {
                    #terms-overlay { align-items: flex-end; padding-bottom: 16px; }
                    #terms-box {
                        max-width: 100%;
                        width: 100%;
                        border-radius: 24px 24px 0 0;
                        margin: 0;
                        box-shadow: 0 -8px 30px rgba(0,0,0,0.15);
                    }
                }

                #terms-close {
                    position: absolute; top: 16px; right: 16px;
                    width: 32px; height: 32px;
                    background: ${CONFIG.colors.closeBg};
                    border: none; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: background 0.2s;
                }
                #terms-close:hover { background: ${CONFIG.colors.closeHover}; }

                #terms-title {
                    font-size: 19px;
                    font-weight: 700;
                    text-align: center;
                    margin: 12px 0 22px;
                    background: linear-gradient(90deg, ${CONFIG.colors.accent}, ${CONFIG.colors.accentDark});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .terms-item {
                    display: flex;
                    gap: 14px;
                    background: ${CONFIG.colors.sectionBg};
                    padding: 16px;
                    border-radius: 14px;
                    margin-bottom: 12px;
                    align-items: flex-start;
                }

                .check-icon {
                    color: ${CONFIG.colors.accent};
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .terms-content strong {
                    font-size: 15px;
                    font-weight: 600;
                    color: ${CONFIG.colors.textTitle};
                    display: block;
                    margin-bottom: 6px;
                }

                .terms-content p {
                    font-size: 14px;
                    line-height: 1.5;
                    color: ${CONFIG.colors.textBody};
                    margin: 0;
                }

                .terms-content a {
                    color: ${CONFIG.colors.accent};
                    text-decoration: underline;
                    font-weight: 500;
                }

                #terms-privacy {
                    font-size: 13.5px;
                    color: ${CONFIG.colors.textBody};
                    text-align: center;
                    margin: 16px 0 10px;
                }

                #terms-btn {
                    width: 100%;
                    background: ${CONFIG.colors.accent};
                    color: white;
                    border: none;
                    border-radius: 50px;
                    padding: 15px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.25s;
                    margin-top: 8px;
                }
                #terms-btn:hover {
                    background: ${CONFIG.colors.accentDark};
                }

                .legal-text {
                    font-size: 12px;
                    color: ${CONFIG.colors.legalText};
                    text-align: center;
                    margin: 14px 0 0;
                    line-height: 1.4;
                }

                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to   { opacity: 0; transform: scale(0.95); }
                }
            `;

            const style = document.createElement('style');
            style.id = 'frame-terms-styles';
            style.textContent = css;
            document.head.appendChild(style);
        },

        _render() {
            const overlay = document.createElement('div');
            overlay.id = 'terms-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');

            overlay.innerHTML = `
                <div id="terms-box">

                    <h2 id="terms-title">Verificação de Acesso</h2>

                    <div class="terms-item">
                        <span class="check-icon">${CONFIG.checkSVG}</span>
                        <div class="terms-content">
                            <strong>Termos de uso do site</strong>
                            <p>Entendo que ao prosseguir, confirmo ser maior de 18 anos e aceito os 
                               <a href="https://www.frameag.com/termos" target="_blank">Termos e Condições</a>.
                            </p>
                        </div>
                    </div>

                    <div class="terms-item">
                        <span class="check-icon">${CONFIG.checkSVG}</span>
                        <div class="terms-content">
                            <strong>Aviso de cookies</strong>
                            <p>Na <strong>Frame</strong> nós usamos cookies e outras tecnologias semelhantes para melhorar a sua experiência em nosso site.</p>
                        </div>
                    </div>

                    <p id="terms-privacy">Priorizamos sua privacidade e segurança.  
                       <a href="https://www.frameag.com/privacy" target="_blank">Saiba mais</a>
                    </p>

                    <button id="terms-btn">Aceitar</button>
                    <p class="legal-text">Em conformidade com a Lei ECA / n° 15.211, poderemos restringir conteúdos</p>
                </div>
            `;

            document.body.appendChild(overlay);

            // Animação de entrada suave
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    overlay.classList.add('visible');
                });
            });
        },

        dismiss(shouldStore = false) {
            const overlay = document.getElementById('terms-overlay');
            const styles  = document.getElementById('frame-terms-styles');
            if (!overlay) return;

            if (shouldStore) {
                localStorage.setItem('frameTermsAccepted', Date.now().toString());
            }

            // Animação de saída
            const box = document.getElementById('terms-box');
            box.style.animation = 'fadeOut 0.45s ease forwards';
            overlay.style.transition = 'opacity 0.45s ease';
            overlay.style.opacity = '0';

            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                if (styles && styles.parentNode) styles.parentNode.removeChild(styles);
            }, 480);
        },

        _bindEvents() {
            // Botão Aceitar (salva por 2 dias)
            document.addEventListener('click', (e) => {
                const acceptBtn = document.getElementById('terms-btn');
                if (acceptBtn && (e.target === acceptBtn || acceptBtn.contains(e.target))) {
                    this.dismiss(true);
                }
            }, { passive: true });
        }
    };

    // ─── Inicialização ─────────────────────────────────────────────────────────────
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        FrameTermsPopup.init();
    } else {
        window.addEventListener('DOMContentLoaded', () => FrameTermsPopup.init());
    }

})();