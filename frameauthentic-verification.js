// ============================================================================ 
// FRAME AUTHENTIC - PROIBIDA COPIA OU REPRODUÇÃO DESTE CÓDIGO SEM AUTORIZAÇÃO - VERIFICAÇÃO FACIAL (V2.1 - UPDATED)
// ============================================================================

(function() {
    // 1. LIMPEZA INICIAL (Anteriores)
    const existingOverlay = document.getElementById('frame-auth-overlay');
    if (existingOverlay) existingOverlay.remove();
    const existingStyle = document.getElementById('frame-auth-style');
    if (existingStyle) existingStyle.remove();

    // 2. CONFIGURAÇÃO E UTILITÁRIOS
    const CONFIG = {
        maxAttempts: 3,
        blockTimeMs: 24 * 60 * 60 * 1000, // 24 horas (Nível 1)
        blockTimeEscalatedMs: 3 * 24 * 60 * 60 * 1000, // 3 dias (Nível 2)
        cameraTimeout: 60000, // 60 segundos
        colors: {
            primary: '#AC865C',     // Marrom Premium
            primaryDark: '#8b6d4d', // Marrom Escuro (Hover)
            bg: '#FFFFFF',          // Sempre branco (sem dark mode)
            text: '#1F1F1F',        // Cinza quase preto
            textLight: '#666666',   // Cinza médio
            error: '#D32F2F',       // Vermelho sóbrio
            surface: '#F9F9F9',     // Fundo leve
            gold: '#C29A63'         // Dourado Desktop
        },
        images: {
            intro: 'https://framerusercontent.com/images/zirbTBNYYut0BLdnqGJSdYbFrI.png',
            watermark: 'https://framerusercontent.com/images/Q5EC3A3Mmxhf8YuGtpPPt9dVwQ.png'
        },
        urls: {
            support: 'https://t.me/suporteframebot?start=bloqueio-verificacao'
        }
    };

    // Ícones SVG otimizados
    const ICONS = {
        back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 21v1"/><path d="M4.2 4.2l.7.7"/><path d="M19.1 19.1l.7.7"/><path d="M1 12h1"/><path d="M22 12h1"/><path d="M4.2 19.8l.7-.7"/><path d="M19.1 4.9l.7-.7"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/></svg>`,
        shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
        headLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v-1a8 8 0 0 1 16 0v1"/><circle cx="12" cy="12" r="4"/><path d="M4 12h-2"/><path d="M22 12h-2"/><path d="M12 21a9 9 0 0 1-9-9"/><path d="M9 15l-3 3 3 3"/></svg>`, // Ilustrativo esquerda
        headRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v-1a8 8 0 0 1 16 0v1"/><circle cx="12" cy="12" r="4"/><path d="M4 12h-2"/><path d="M22 12h-2"/><path d="M12 21a9 9 0 0 0 9-9"/><path d="M15 15l3 3-3 3"/></svg>` // Ilustrativo direita
    };

    // 3. INJEÇÃO DE CSS 
    const style = document.createElement('style');
    style.id = 'frame-auth-style';
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        :root {
            --fa-primary: ${CONFIG.colors.primary};
            --fa-primary-dark: ${CONFIG.colors.primaryDark};
            --fa-bg: ${CONFIG.colors.bg};
            --fa-text: ${CONFIG.colors.text};
            --fa-text-light: ${CONFIG.colors.textLight};
            --fa-error: ${CONFIG.colors.error};
            --fa-surface: ${CONFIG.colors.surface};
            --fa-gold: ${CONFIG.colors.gold};
        }

        #frame-auth-overlay * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        #frame-auth-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.98);
            z-index: 99999;
            font-family: 'Montserrat', sans-serif;
            color: var(--fa-text);
            display: flex; justify-content: center; align-items: center;
            overflow: hidden;
        }

        .fa-container {
            width: 100%; max-width: 480px; height: 100%; max-height: 850px;
            background: var(--fa-bg);
            position: relative;
            display: flex; flex-direction: column;
            overflow: hidden;
        }

        /* --- HEADER --- */
        .fa-header {
            padding: 20px 20px 10px 20px;
            flex-shrink: 0;
            display: flex; flex-direction: column; gap: 10px;
        }
        .fa-header-top {
            display: grid;
            grid-template-columns: 40px 1fr 40px; 
            align-items: center;
            height: 40px;
        }
        .fa-btn-icon {
            background: none; border: none; cursor: pointer; color: var(--fa-text);
            width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
            border-radius: 50%; transition: background 0.2s;
        }
        .fa-btn svg { width: 18px; height: 18px; flex-shrink: 0; display: block; }
        .fa-btn-icon:hover { background: var(--fa-surface); }
        .fa-header-title {
            font-weight: 600; font-size: 16px; text-align: center; margin: 0;
        }

        /* --- PROGRESS BAR --- */
        .fa-progress-container {
            width: 100%; height: 4px; background: #EEE; border-radius: 2px; overflow: hidden;
        }
        .fa-progress-bar {
            height: 100%; width: 0%;
            background: linear-gradient(90deg, #d4bda5, var(--fa-primary));
            transition: width 0.4s ease;
        }

        /* --- VIEWS --- */
        .fa-view {
            flex: 1; display: none; flex-direction: column; align-items: center;
            padding: 10px 24px 110px 24px; /* Mais padding bottom para footer */
            width: 100%; height: 100%;
            animation: faFadeIn 0.4s ease-out;
            overflow-y: auto;
            position: relative;
        }
        .fa-view.active { display: flex; }
        @keyframes faFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- TYPOGRAPHY & ELEMENTS --- */
        .fa-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 12px; color: var(--fa-text); }
        .fa-text { font-size: 15px; color: var(--fa-text-light); text-align: center; line-height: 1.5; margin-bottom: 24px; }
        
        .fa-btn {
            background: var(--fa-primary); color: #fff; border: none;
            width: 100%; max-width: 320px; padding: 16px;
            font-size: 16px; font-weight: 600;
            border-radius: 50px;
            cursor: pointer; transition: transform 0.1s, background 0.2s, box-shadow 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 10px;
            margin-top: auto; 
            box-shadow: 0 4px 15px rgba(172, 134, 92, 0.3);
            text-decoration: none;
        }
        .fa-btn:hover { background: var(--fa-primary-dark); transform: translateY(-1px); }
        .fa-btn:active { transform: scale(0.98); }
        .fa-btn.secondary { background: #EFEFEF; color: var(--fa-text); box-shadow: none; margin-top: 10px; }
        .fa-btn.secondary:hover { background: #E0E0E0; }
        .fa-btn.outline {
            background: transparent; border: 2px solid var(--fa-primary); color: var(--fa-primary); box-shadow: none; margin-top: 10px;
        }
        .fa-btn.outline:hover { background: var(--fa-surface); }
        .fa-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* --- INTRO SCREEN --- */
        .fa-hero-img { width: 00%; max-width: 320px; margin: 20px 0; object-fit: contain; }
        .fa-tips { width: 100%; text-align: left; background: var(--fa-surface); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .fa-tip-item { display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; }
        .fa-tip-item:last-child { margin-bottom: 0; }
        .fa-tip-icon { color: var(--fa-primary); width: 24px; height: 24px; flex-shrink: 0; }
        .fa-tip-text { font-size: 13px; color: var(--fa-text); font-weight: 500; }

        /* --- CAMERA & CAPTURE --- */
        .fa-camera-wrapper {
            position: relative; width: 100%; max-width: 340px; aspect-ratio: 3/4;
            margin: 20px 0; display: flex; justify-content: center;
        }
        .fa-camera-frame {
            width: 100%; height: 100%;
            border-radius: 160px; /* Oval Vertical */
            overflow: hidden;
            position: relative;
            background: #000;
            border: 6px solid var(--fa-primary);
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transform: translateZ(0);
        }
        #fa-video-element, #fa-canvas-element, #fa-review-image {
            width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); /* Espelhar */
        }
        #fa-canvas-element { display: none; }
        
        /* Scan Effect */
        .fa-scan-line {
            position: absolute; top: 0; left: 0; width: 100%; height: 4px;
            background: rgba(255,255,255,0.7);
            box-shadow: 0 0 20px 5px rgba(255,255,255,0.5);
            animation: scanMove 3s infinite ease-in-out;
            opacity: 0.6; display: none;
        }
        .fa-view.camera-active .fa-scan-line { display: block; }
        @keyframes scanMove { 0% { top: 5%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 95%; opacity: 0; } }

        .fa-instruction-badge {
            background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 20px;
            font-size: 12px; font-weight: 600; color: var(--fa-primary);
            position: absolute; top: 16px; z-index: 10;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        /* Instruções Grandes Sequenciais */
        .fa-big-instruction {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 100%; text-align: center; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5); pointer-events: none; opacity: 0; transition: opacity 0.3s;
            z-index: 20;
            display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .fa-big-instruction.visible { opacity: 1; }
        .fa-instruction-icon svg { width: 48px; height: 48px; }

        /* --- PROCESSING & LOADING --- */
        .fa-loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; }
        .fa-spinner-box { position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
        .fa-spinner {
            width: 100%; height: 100%; border: 4px solid rgba(172, 134, 92, 0.2);
            border-top: 4px solid var(--fa-primary); border-radius: 50%;
            animation: spin 1s linear infinite; position: absolute;
        }
        .fa-icon-animate { width: 40px; height: 40px; color: var(--fa-primary); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* --- ERROR / RESULT --- */
        .fa-compare-container { display: flex; gap: 10px; margin: 20px 0; width: 100%; justify-content: center; }
        .fa-compare-box { width: 45%; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; position: relative; }
        .fa-compare-img { width: 100%; height: 100%; object-fit: cover; }
        .fa-compare-label { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; text-align: center; padding: 4px; }
        .fa-blur { filter: blur(2.5px) brightness(0.75) contrast(0.9) saturate(0.6); }

        /* --- LOCKED SCREEN --- */
        .fa-lock-timer { font-size: 32px; font-weight: 700; color: var(--fa-primary); margin: 20px 0; font-variant-numeric: tabular-nums; }
        .fa-locked-image { width: 100%; max-width: 260px; margin: 10px auto 10px auto; display: block; object-fit: contain; }

        /* --- MINI POWERED FOOTER --- */
        .fa-mini-powered {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            width: auto; height: 21px; opacity: 0.8; pointer-events: none; z-index: 5;
        }

        /* --- BOTTOM SHEET POPUP --- */
        .fa-sheet-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9999;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
            display: flex; align-items: flex-end; justify-content: center;
        }
        .fa-sheet-overlay.open { opacity: 1; pointer-events: auto; }
        
        .fa-sheet {
            background: white; width: 100%; max-width: 480px;
            border-radius: 24px 24px 0 0; padding: 30px 24px 40px 24px;
            transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .fa-sheet-overlay.open .fa-sheet { transform: translateY(0); }
        
        .fa-sheet-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--fa-text); }
        .fa-sheet-text { font-size: 14px; color: var(--fa-text-light); margin-bottom: 24px; line-height: 1.5; }
        .fa-sheet-btn-group { width: 100%; display: flex; flex-direction: column; gap: 10px; }

        /* --- DESKTOP QR VIEW --- */
        #view-desktop-qr {
            font-family: 'Poppins', sans-serif;
            background: rgba(255,255,255,0.95);
        }
        .fa-qr-container {
            border: 2px solid var(--fa-gold);
            border-radius: 20px;
            padding: 30px;
            background: #fff;
            display: flex; flex-direction: column; align-items: center;
            box-shadow: 0 10px 30px rgba(194, 154, 99, 0.15);
            margin-top: 20px;
        }
        #qrcode img { display: block; margin: 0 auto; }
        .fa-qr-timer {
            font-size: 14px; font-weight: 600; color: var(--fa-gold); margin-top: 15px;
        }

        /* --- COUNTDOWN OVERLAY --- */
        .fa-countdown-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.9); z-index: 50;
            display: none; flex-direction: column; align-items: center; justify-content: center;
        }
        .fa-countdown-overlay.active { display: flex; }
        .fa-mini-spinner {
            width: 30px; height: 30px; border: 3px solid rgba(172, 134, 92, 0.2);
            border-top: 3px solid var(--fa-primary); border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 15px;
        }
        .fa-countdown-text { font-size: 14px; font-weight: 600; color: var(--fa-text); }
        .fa-countdown-number { font-size: 48px; font-weight: 700; color: var(--fa-primary); margin-top: 10px; }

        /* Responsive */
        @media (max-height: 700px) {
            .fa-camera-wrapper { max-width: 240px; margin: 10px 0; }
            .fa-hero-img { width: 160px; }
            .fa-view { padding-bottom: 110px; }
        }
    `;
    document.head.appendChild(style);

    // 4. ESTRUTURA HTML (Single Page Application)
    const htmlStructure = `
    <div id="frame-auth-overlay">
        <div class="fa-container">
            <div class="fa-header" id="fa-header">
                <div class="fa-header-top">
                    <button class="fa-btn-icon" id="fa-back-btn">${ICONS.back}</button>
                    <div class="fa-header-title" id="fa-header-title-text">Reconhecimento Facial</div>
                    <div style="width:40px"></div>
                </div>
                <div class="fa-progress-container">
                    <div class="fa-progress-bar" id="fa-progress-bar"></div>
                </div>
            </div>

            <div class="fa-view active" id="view-intro">
                <div class="fa-title">Vamos verificar<br>sua identidade</div>
                <img src="${CONFIG.images.intro}" class="fa-hero-img">
                
                <div class="fa-tips">
                    <div class="fa-tip-item">
                        <div class="fa-tip-icon">${ICONS.bulb}</div>
                        <div class="fa-tip-text">Escolha um ambiente bem iluminado. Evite luz forte atrás de você.</div>
                    </div>
                    <div class="fa-tip-item">
                        <div class="fa-tip-icon">${ICONS.shield}</div>
                        <div class="fa-tip-text">Seus dados são usados apenas para validação de segurança na Frame Agency.</div>
                    </div>
                </div>

                <button class="fa-btn" id="btn-intro-next">Continuar ${ICONS.back.replace('d="M19', 'transform="rotate(180, 12, 12)" d="M19')}</button>
            </div>

            <div class="fa-view" id="view-desktop-qr" style="justify-content:center;">
                <div class="fa-title" style="font-family:'Poppins',sans-serif;">Escaneie o QR CODE para verificar</div>
                <div class="fa-text" style="font-family:'Poppins',sans-serif;">Para sua segurança e uma melhor experiência na verificação facial, recomendamos que você utilize um dispositivo móvel nessa etapa.</div>
                
                <div class="fa-qr-container">
                    <div id="qrcode"></div>
                    <div class="fa-qr-timer" id="qr-timer">05:00</div>
                </div>
                
                <div class="fa-text" style="margin-top:20px; font-size:12px;">Aponte a câmera do seu celular</div>
            </div>

            <div class="fa-view" id="view-permission">
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <div style="width:80px; height:80px; background:var(--fa-surface); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--fa-primary); margin-bottom:24px;">
                        ${ICONS.camera}
                    </div>
                    <div class="fa-title">Ative a sua<br>câmera</div>
                    <div class="fa-text">Para confirmar sua identidade com precisão, precisamos de acesso temporário à câmera do seu dispositivo.</div>
                </div>
                <button class="fa-btn" id="btn-allow-camera">Permitir acesso</button>
            </div>

            <div class="fa-view" id="view-camera">
                <div class="fa-instruction-badge" id="camera-badge">Posicione seu rosto</div>
                <div class="fa-camera-wrapper">
                    <div class="fa-camera-frame">
                        <video id="fa-video-element" autoplay playsinline muted></video>
                        <canvas id="fa-canvas-element"></canvas>
                        <div class="fa-scan-line"></div>
                        <div class="fa-big-instruction" id="fa-big-instruction"></div>
                        
                        <div class="fa-countdown-overlay" id="fa-countdown-overlay">
                            <div class="fa-mini-spinner"></div>
                            <div class="fa-countdown-text">Preparando câmera...</div>
                            <div class="fa-countdown-number" id="fa-countdown-number"></div>
                        </div>

                    </div>
                </div>
                <div class="fa-text" id="camera-instructions">Mantenha o celular na altura dos olhos e clique para começar.</div>
                
                <button class="fa-btn" id="btn-capture">Começar</button>
            </div>

            <div class="fa-view" id="view-review">
                <div class="fa-title">A foto ficou boa?</div>
                <div class="fa-text">Certifique-se de que seu rosto esteja nítido e sem reflexos.
Após o envio, nossa tecnologia realizará a análise dos dados biométricos.</div>
                <div class="fa-camera-wrapper">
                    <div class="fa-camera-frame" style="border-color: #ddd;">
                        <img id="fa-review-image">
                    </div>
                </div>
                <button class="fa-btn" id="btn-confirm-photo">Enviar foto</button>
                <button class="fa-btn secondary" id="btn-retake">Tirar novamente</button>
            </div>

            <div class="fa-view" id="view-processing" style="justify-content:center;">
                <div class="fa-spinner-box">
                    <div class="fa-spinner"></div>
                    <div id="processing-icon" class="fa-icon-animate">${ICONS.user}</div>
                </div>
                <div class="fa-title" id="processing-title">Validando...</div>
                <div class="fa-text" id="processing-subtitle">Aguarde enquanto analisamos seus dados.</div>
            </div>

            <div class="fa-view" id="view-error">
                <div style="color:var(--fa-error); margin:20px 0;">${ICONS.warning}</div>
                <div class="fa-title">Não foi possível concluir a validação da sua foto</div>
                <div class="fa-text" id="error-reason-text">Não conseguimos validar sua foto.</div>
                
                <div class="fa-compare-container">
                    <div class="fa-compare-box">
                        <img id="error-user-img" class="fa-compare-img fa-blur">
                        <div class="fa-compare-label" style="background:rgba(211, 47, 47, 0.8)">Sua foto</div>
                    </div>
                    <div class="fa-compare-box">
                        <div style="width:100%; height:100%; background:#eee; display:flex; align-items:center; justify-content:center;">
                             <img src="https://framerusercontent.com/images/mHH4Rr4lSefIKdgU3T15dg5G14.png" style="width:100%; opacity:1;">
                        </div>
                        <div class="fa-compare-label" style="background:rgba(76, 175, 80, 0.8)">Imagem ideal</div>
                    </div>
                </div>

                <div class="fa-text">Vamos tentar novamente? Siga nossas dicas sobre iluminação e ângulos.</div>
                <button class="fa-btn" id="btn-retry-flow">Tentar novamente</button>
                <div style="margin-top:15px; font-size:12px; color:#999;" id="attempts-display"></div>
            </div>

            <div class="fa-view" id="view-locked">
                <img 
                    src="https://framerusercontent.com/images/xNUS3aT2l7cjcIaseDNww9QbTKE.png"
                    alt="Acesso bloqueado"
                    class="fa-locked-image"
                >
                <div style="color:var(--fa-error); margin:20px 0;">
                    ${ICONS.lock}
                </div>
                <div class="fa-title">Seu acesso foi bloqueado</div>
                <div class="fa-text" id="locked-text">
                    O limite de tentativas foi atingido.
                </div>
                <div class="fa-lock-timer" id="lock-timer">00:00:00</div>
                <button class="fa-btn secondary" id="btn-close-app">Fechar</button>
                <a href="${CONFIG.urls.support}" target="_blank" class="fa-btn outline" id="btn-support" style="text-decoration:none;">Falar com suporte</a>
            </div>

            <img src="${CONFIG.images.watermark}" class="fa-mini-powered">

            <div id="fa-sheet-overlay" class="fa-sheet-overlay">
                <div class="fa-sheet" id="fa-sheet-content">
                    <div style="width:40px; height:4px; background:#ddd; border-radius:2px; margin-bottom:20px;"></div>
                    <div class="fa-sheet-title" id="sheet-title">Título</div>
                    <div class="fa-sheet-text" id="sheet-text">Mensagem</div>
                    <div class="fa-sheet-btn-group" id="sheet-actions"></div>
                </div>
            </div>

        </div>
    </div>
    `;

    // 5. INSERIR NO DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlStructure;
    document.body.appendChild(wrapper.firstElementChild);

    // 6. LÓGICA DE NEGÓCIO (STATE MACHINE)
    const elements = {
        views: {
            intro: document.getElementById('view-intro'),
            permission: document.getElementById('view-permission'),
            camera: document.getElementById('view-camera'),
            review: document.getElementById('view-review'),
            processing: document.getElementById('view-processing'),
            error: document.getElementById('view-error'),
            locked: document.getElementById('view-locked'),
            desktopQr: document.getElementById('view-desktop-qr')
        },
        buttons: {
            introNext: document.getElementById('btn-intro-next'),
            allowCamera: document.getElementById('btn-allow-camera'),
            capture: document.getElementById('btn-capture'),
            confirm: document.getElementById('btn-confirm-photo'),
            retake: document.getElementById('btn-retake'),
            retry: document.getElementById('btn-retry-flow'),
            back: document.getElementById('fa-back-btn')
        },
        video: document.getElementById('fa-video-element'),
        canvas: document.getElementById('fa-canvas-element'),
        reviewImg: document.getElementById('fa-review-image'),
        errorUserImg: document.getElementById('error-user-img'),
        header: document.getElementById('fa-header'),
        headerTitle: document.getElementById('fa-header-title-text'),
        processingIcon: document.getElementById('processing-icon'),
        processingTitle: document.getElementById('processing-title'),
        attemptsDisplay: document.getElementById('attempts-display'),
        progressBar: document.getElementById('fa-progress-bar'),
        bigInstruction: document.getElementById('fa-big-instruction'),
        sheetOverlay: document.getElementById('fa-sheet-overlay'),
        sheetTitle: document.getElementById('sheet-title'),
        sheetText: document.getElementById('sheet-text'),
        sheetActions: document.getElementById('sheet-actions'),
        countdownOverlay: document.getElementById('fa-countdown-overlay'),
        countdownNumber: document.getElementById('fa-countdown-number')
    };

    let state = {
        stream: null,
        attempts: 0,
        cameraReady: false,
        capturedImage: null,
        inactivityTimer: null,
        isDevToolsOpen: false,
        hasPreparedCamera: false // 👈 NOVO
};

    // --- INDEXED DB HELPERS ---
    const DB_NAME = "FrameAuthDB";
    const DB_STORE = "blockState";
    let dbInstance = null;

    function initDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DB_STORE)) {
                    db.createObjectStore(DB_STORE);
                }
            };
            request.onsuccess = (event) => {
                dbInstance = event.target.result;
                resolve(true);
            };
            request.onerror = () => {
                console.error("IDB Error");
                resolve(false); // Fallback to localStorage logic inside functions
            };
        });
    }

    function setDBValue(key, value) {
        return new Promise((resolve) => {
            try {
                if (dbInstance) {
                    const tx = dbInstance.transaction(DB_STORE, "readwrite");
                    const store = tx.objectStore(DB_STORE);
                    store.put(value, key);
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => { localStorage.setItem(key, value); resolve(); };
                } else {
                    localStorage.setItem(key, value);
                    resolve();
                }
            } catch(e) {
                localStorage.setItem(key, value);
                resolve();
            }
        });
    }

    function getDBValue(key) {
        return new Promise((resolve) => {
            try {
                if (dbInstance) {
                    const tx = dbInstance.transaction(DB_STORE, "readonly");
                    const store = tx.objectStore(DB_STORE);
                    const req = store.get(key);
                    req.onsuccess = () => resolve(req.result || localStorage.getItem(key));
                    req.onerror = () => resolve(localStorage.getItem(key));
                } else {
                    resolve(localStorage.getItem(key));
                }
            } catch (e) {
                resolve(localStorage.getItem(key));
            }
        });
    }

    function removeDBValue(key) {
        return new Promise((resolve) => {
            try {
                if(dbInstance) {
                    const tx = dbInstance.transaction(DB_STORE, "readwrite");
                    const store = tx.objectStore(DB_STORE);
                    store.delete(key);
                }
                localStorage.removeItem(key);
                resolve();
            } catch(e) {
                localStorage.removeItem(key);
                resolve();
            }
        });
    }

    // --- BROADCAST CHANNEL (Abas duplicadas) ---
    const broadcast = new BroadcastChannel('frame_auth_channel');
    broadcast.postMessage('new_tab_opened');
    broadcast.onmessage = (event) => {
        if (event.data === 'new_tab_opened') {
            // Se eu recebi essa mensagem, sou uma aba antiga ou duplicada
            broadcast.postMessage('tab_exists');
            showSingleButtonSheet(
                "Múltiplas abas detectadas", 
                "Para evitar erros ou fraudes em sua verificação, feche as abas extras abertas e continue em apenas uma delas.",
                "Fechar esta aba",
                () => window.close()
            );
        } else if (event.data === 'tab_exists') {
            showSingleButtonSheet(
                "Múltiplas abas detectadas", 
                "Para evitar erros ou fraudes em sua verificação, feche as abas extras abertas e continue em apenas uma delas.",
                "Fechar aba",
                () => window.close()
            );
        }
    };

    // --- CONTROLE DE PROGRESS BAR ---
    function updateProgressBar(viewName) {
        let percentage = 0;
        switch(viewName) {
            case 'intro': percentage = 10; break;
            case 'permission': percentage = 30; break;
            case 'camera': percentage = 50; break;
            case 'processing': percentage = 75; break;
            case 'review': percentage = 90; break;
            case 'error': percentage = 50; break; // Volta
            case 'locked': percentage = 100; break;
        }
        elements.progressBar.style.width = percentage + '%';
    }

    // --- CONTROLE DE BLOQUEIO ESCALADO ---
    async function checkBlockStatus() {
        const blockEnd = await getDBValue('fa_block_end');
        if (blockEnd && Date.now() < parseInt(blockEnd)) {
            const level = (await getDBValue('fa_block_level')) || '1';
            
            let text = "O limite de tentativas foi atingido por falhas consecutivas na verificação facial. Por segurança, aguarde o prazo de 24h.";
            if (level === '2') {
                text = "Acesso bloqueado por 3 dias devido a falhas repetidas na verificação. Caso persista em tentativas inválidas, seu acesso ao Frame Authentic poderá ser bloqueado de forma permanente. Recomendamos revisar as instruções e tentar novamente após o período.";
            }

            document.getElementById('locked-text').textContent = text;
            startLockTimer(parseInt(blockEnd));
            switchView('locked');
            return true;
        }
        // Se expirou, limpa
        if (blockEnd && Date.now() >= parseInt(blockEnd)) {
            await removeDBValue('fa_block_end');
        }
        return false;
    }

    function switchView(viewName) {
        // Esconde todas
        Object.values(elements.views).forEach(el => {
            if(el) { // check if exists (desktopQr)
                el.classList.remove('active');
                el.classList.remove('camera-active');
            }
        });
        
        // Header visibility
        if (viewName === 'processing' || viewName === 'locked') {
            elements.header.style.visibility = 'hidden';
        } else {
            elements.header.style.visibility = 'visible';
        }

        // Locked Title Update
        if (viewName === 'locked') {
            elements.headerTitle.textContent = "Frame Authentic restrito";
            elements.header.style.visibility = 'visible'; // Show header for locked title
        } else {
            elements.headerTitle.textContent = "Reconhecimento Facial";
        }

        if(elements.views[viewName]) {
            elements.views[viewName].classList.add('active');
            if (viewName === 'camera') elements.views[viewName].classList.add('camera-active');
        }

        updateProgressBar(viewName);
    }

    // --- BOTTOM SHEET MANAGER ---
    function openSheet(title, text, buttonsHtml) {
        elements.sheetTitle.textContent = title;
        elements.sheetText.textContent = text;
        elements.sheetActions.innerHTML = buttonsHtml;
        elements.sheetOverlay.classList.add('open');
    }

    function closeSheet() {
        elements.sheetOverlay.classList.remove('open');
    }
    
    // Fecha ao clicar fora
    elements.sheetOverlay.addEventListener('click', (e) => {
        if (e.target === elements.sheetOverlay) closeSheet();
    });

    // Helper para popup de confirmação
    function confirmAction(title, text, confirmLabel, cancelLabel, onConfirm) {
        const btns = `
            <button class="fa-btn" id="sheet-btn-confirm">${confirmLabel}</button>
            <button class="fa-btn secondary" id="sheet-btn-cancel">${cancelLabel}</button>
        `;
        openSheet(title, text, btns);
        document.getElementById('sheet-btn-confirm').onclick = () => { closeSheet(); onConfirm(); };
        document.getElementById('sheet-btn-cancel').onclick = closeSheet;
    }

    // Helper para popup de alerta único
    function showSingleButtonSheet(title, text, btnLabel, action) {
        const btns = `<button class="fa-btn" id="sheet-btn-ok">${btnLabel}</button>`;
        openSheet(title, text, btns);
        document.getElementById('sheet-btn-ok').onclick = () => { closeSheet(); if(action) action(); };
    }

    // --- DETECÇÃO DEVTOOLS ---
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if ((widthThreshold || heightThreshold) && !state.isDevToolsOpen) {
            state.isDevToolsOpen = true;
            // Para verificação
            if(state.stream) stopCamera();
            
            showSingleButtonSheet(
                "Violação dos Termos e Condições",
                "Detectamos que as ferramentas de desenvolvedor (DevTools) estão abertas. Isso pode comprometer a integridade do processo de verificação e viola nossos Termos. Feche as DevTools e recarregue a página para continuar. Caso persista, sua conta poderá ser bloqueada permanentemente.",
                "Entendi, fechar",
                () => { 
                    location.reload(); 
                }
            );
            // Travar fechamento pelo fundo
            elements.sheetOverlay.onclick = null; 
        }
    }
    setInterval(detectDevTools, 1000);

    // --- CÂMERA & TIMEOUT ---
    function resetInactivityTimer() {
        if (state.inactivityTimer) clearTimeout(state.inactivityTimer);
        // Só ativa se estiver na view camera
        if (elements.views.camera.classList.contains('active')) {
            state.inactivityTimer = setTimeout(() => {
                stopCamera();
                switchView('intro');
                showSingleButtonSheet("Sessão expirada", "Sessão expirada por inatividade. Por favor, inicie a verificação novamente.", "Reiniciar agora");
            }, CONFIG.cameraTimeout);
        }
    }

    // Listeners de atividade na câmera
    elements.views.camera.addEventListener('click', resetInactivityTimer);
    elements.views.camera.addEventListener('mousemove', resetInactivityTimer);

    async function startCamera() {
        try {
            const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
            state.stream = await navigator.mediaDevices.getUserMedia(constraints);
            elements.video.srcObject = state.stream;
            
            elements.video.onloadedmetadata = () => {
                switchView('camera');
                resetInactivityTimer();
                elements.buttons.capture.style.display = 'flex'; // Garante que volta
                elements.buttons.capture.textContent = "Começar";
                state.cameraReady = false; 
                document.getElementById('camera-instructions').textContent = "Mantenha o celular na altura dos olhos e clique para começar.";
                document.getElementById('camera-badge').textContent = "Posicione seu rosto";
                document.querySelector('.fa-scan-line').style.display = 'none';
                elements.countdownOverlay.classList.remove('active');
            };
        } catch (err) {
            showSingleButtonSheet(
                "Acesso à câmera negado", 
                "Para prosseguir com a verificação facial, permita o acesso à câmera. Verifique as permissóes e tente novamente.", 
                "Tentar novamente",
                () => switchView('permission')
            );
        }
    }

    function stopCamera() {
        if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop());
            state.stream = null;
        }
        if (state.inactivityTimer) clearTimeout(state.inactivityTimer);
    }

    function showInstruction(text, duration, iconHtml) {
        return new Promise(resolve => {
            elements.bigInstruction.innerHTML = iconHtml ? `<div class="fa-instruction-icon">${iconHtml}</div><div>${text}</div>` : text;
            elements.bigInstruction.classList.add('visible');
            setTimeout(() => {
                elements.bigInstruction.classList.remove('visible');
                setTimeout(resolve, 400); // tempo do fade out
            }, duration);
        });
    }

    async function runAutoCaptureSequence() {
        elements.buttons.capture.style.display = 'none'; // Esconde botão
        document.getElementById('camera-instructions').textContent = "Siga as instruções na tela...";
        document.querySelector('.fa-scan-line').style.display = 'block';

        // Sequência
        await showInstruction("Mova sua cabeça para a esquerda", 2500, ICONS.headLeft);
        await showInstruction("Mova sua cabeça para a direita", 2500, ICONS.headRight);
        await showInstruction("Olhe para frente", 2000);
        await showInstruction("Mantenha-se parado", 2500);
        
        takePicture();
    }

    function takePicture() {
        const context = elements.canvas.getContext('2d');
        elements.canvas.width = elements.video.videoWidth;
        elements.canvas.height = elements.video.videoHeight;
        
        // Desenha espelhado no canvas para salvar
        context.save();
        context.scale(-1, 1);
        context.drawImage(elements.video, -elements.canvas.width, 0);
        context.restore();
        
        const dataUrl = elements.canvas.toDataURL('image/jpeg', 0.85);
        state.capturedImage = dataUrl;
        
        // VIBRAÇÃO
        if (navigator.vibrate) navigator.vibrate(200);

        // Set images logic
        
        // Redraw normal for storage/backend logic integrity if needed usually, but user asked for Mirror UI.
        // Let's stick to: Canvas Raw (Normal) -> UI CSS (Mirrored).
        context.clearRect(0,0, elements.canvas.width, elements.canvas.height);
        context.drawImage(elements.video, 0, 0); 
        const rawDataUrl = elements.canvas.toDataURL('image/jpeg', 0.85);
        
        elements.reviewImg.src = rawDataUrl; // CSS fará o flip
        elements.errorUserImg.src = rawDataUrl; // CSS fará o flip
        
        stopCamera();
        switchView('review');
    }

    // --- SEQUÊNCIA DE VALIDAÇÃO (MOCK) ---
    function processVerification() {
        switchView('processing');
        
        elements.processingIcon.innerHTML = ICONS.user;
        elements.processingTitle.textContent = "Validando sua biometria...";
        
        setTimeout(() => {
            elements.processingIcon.innerHTML = ICONS.lock;
            elements.processingIcon.style.animation = 'none';
            elements.processingIcon.offsetHeight; /* trigger reflow */
            elements.processingIcon.style.animation = 'popIn 0.5s ease';
            elements.processingTitle.textContent = "Dados protegidos com segurança Frame...";
            
            setTimeout(() => {
                handleFail(); // Mock falha
            }, 2000);
        }, 2000);
    }

    async function handleFail() {
        state.attempts++;
        const remaining = CONFIG.maxAttempts - state.attempts;
        
        if (remaining <= 0) {
            // Lógica de Bloqueio Escalado
            let currentLevel = (await getDBValue('fa_block_level')) || '0';
            let nextLevel = currentLevel === '0' ? '1' : '2';
            
            let blockDuration = (nextLevel === '2') ? CONFIG.blockTimeEscalatedMs : CONFIG.blockTimeMs;
            
            await setDBValue('fa_block_level', nextLevel);
            const unlockTime = Date.now() + blockDuration;
            await setDBValue('fa_block_end', unlockTime);
            
            startLockTimer(unlockTime);
            // Recarregar status para atualizar texto
            checkBlockStatus();
        } else {
            // Erros na validação
            const reasons = ["Iluminação insuficiente", "Rosto não centralizado", "Baixa qualidade de imagem"];
            const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
            document.getElementById('error-reason-text').textContent = randomReason;
            elements.attemptsDisplay.textContent = `Tentativas restantes: ${remaining}`;
            switchView('error');
        }
    }

    function startLockTimer(endTime) {
        const update = () => {
            const now = Date.now();
            const diff = endTime - now;
            if (diff <= 0) {
                removeDBValue('fa_block_end');
                // Não resetamos o nível aqui imediatamente para manter histórico se quiser,
                // mas para UX de loop, vamos considerar limpo.
                location.reload();
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            
            let timeString = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            if (days > 0) timeString = `${days}d ${timeString}`;
            
            document.getElementById('lock-timer').textContent = timeString;
            requestAnimationFrame(update);
        };
        update();
    }

    // --- COUNTDOWN SEQUENCE ---
    function startCountdownSequence() {
        elements.countdownOverlay.classList.add('active');
        let count = 3;
        elements.countdownNumber.textContent = ""; // Blank initially or set 3? "Preparando..." uses spinner
        
        // Passo 1: Preparando (Spinner) já está no CSS. Wait 500ms
        setTimeout(() => {
             // Countdown
             const interval = setInterval(() => {
                 elements.countdownNumber.textContent = count;
                 if (count <= 0) {
                     clearInterval(interval);
                     elements.countdownOverlay.classList.remove('active');
                     runAutoCaptureSequence();
                 }
                 count--;
             }, 1000);
        }, 500);
    }

    // --- DESKTOP QR LOGIC ---
    function initDesktopQR() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => {
            new QRCode(document.getElementById("qrcode"), {
                text: window.location.href,
                width: 180,
                height: 180,
                colorDark : CONFIG.colors.primary,
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            startQRTimer();
        };
        document.body.appendChild(script);
        switchView('desktopQr');
    }

    function startQRTimer() {
        let duration = 5 * 60; // 5 minutos
        const display = document.getElementById('qr-timer');
        const timer = setInterval(() => {
            const m = Math.floor(duration / 60);
            const s = duration % 60;
            display.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            
            if (--duration < 0) {
                clearInterval(timer);
                display.textContent = "Expirado, reinicie a página.";
                // Reload or block? Just freeze for now.
            }
        }, 1000);
    }

    // 7. EVENT LISTENERS
    
    // Intro -> Permission
    elements.buttons.introNext.onclick = () => {
        navigator.permissions.query({name: 'camera'}).then(res => {
            if (res.state === 'granted') startCamera();
            else switchView('permission');
        }).catch(() => switchView('permission'));
    };

    // Permission -> Camera
    elements.buttons.allowCamera.onclick = () => {
        startCamera();
    };

    // Camera Start Sequence
elements.buttons.capture.onclick = () => {
    if (!state.cameraReady) {
        state.cameraReady = true;

        if (!state.hasPreparedCamera) {
            state.hasPreparedCamera = true; // marca que já preparou
            startCountdownSequence();       // primeira vez
        } else {
            // próximas tentativas → direto
            runAutoCaptureSequence();
        }
    }
};

    // Review Actions
    elements.buttons.confirm.onclick = processVerification;
    elements.buttons.retake.onclick = () => startCamera();
    elements.buttons.retry.onclick = () => startCamera();

    // Botão Voltar (Header) com Popup
    elements.buttons.back.onclick = () => {
        confirmAction(
            "Tem certeza que deseja sair?",
            "A verificação é necessária para finalizarmos seu acesso a conta na Frame Agency.",
            "Sair", "Voltar",
            () => { window.location.href = "https://www.frameag.com/cadastro"; }
        );
    };

    // Fechar app (Bloqueado)
    document.getElementById('btn-close-app').onclick = () => {
        window.location.href = "https://www.frameag.com/cadastro";
    };

    // 8. INICIALIZAÇÃO
    (async function init() {
        // Detect Mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 800);
        
        if (!isMobile) {
            initDesktopQR();
            return;
        }

        await initDB();

        if (!(await checkBlockStatus())) {
            switchView('intro');
        }
    })();

})();