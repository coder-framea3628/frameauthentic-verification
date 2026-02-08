// ============================================================================
// FRAME AUTHENTIC - PROIBIDA COPIA OU REPRODUÇÃO DESTE CÓDIGO SEM AUTORIZAÇÃO - VERIFICAÇÃO FACIAL (V2.0)
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
        blockTimeMs: 24 * 60 * 60 * 1000, // 24 horas
        colors: {
            primary: '#AC865C',     // Marrom Premium
            primaryDark: '#8b6d4d', // Marrom Escuro (Hover)
            bg: '#FFFFFF',          // Sempre branco (sem dark mode)
            text: '#1F1F1F',        // Cinza quase preto
            textLight: '#666666',   // Cinza médio
            error: '#D32F2F',       // Vermelho sóbrio
            surface: '#F9F9F9'      // Fundo leve
        },
        images: {
            intro: 'https://framerusercontent.com/images/zirbTBNYYut0BLdnqGJSdYbFrI.png',
            watermark: 'https://framerusercontent.com/images/Q5EC3A3Mmxhf8YuGtpPPt9dVwQ.png'
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
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
    };

    // 3. INJEÇÃO DE CSS 
    const style = document.createElement('style');
    style.id = 'frame-auth-style';
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        :root {
            --fa-primary: ${CONFIG.colors.primary};
            --fa-primary-dark: ${CONFIG.colors.primaryDark};
            --fa-bg: ${CONFIG.colors.bg};
            --fa-text: ${CONFIG.colors.text};
            --fa-text-light: ${CONFIG.colors.textLight};
            --fa-error: ${CONFIG.colors.error};
            --fa-surface: ${CONFIG.colors.surface};
        }

        #frame-auth-overlay * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        #frame-auth-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.98); /* Fundo quase sólido para imersão */
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
           padding: 20px;
           height: 60px;
           flex-shrink: 0;

           display: grid;
           grid-template-columns: 40px 1fr 40px; /* botão | título | espaço */
           align-items: center;
      }
        .fa-btn-icon {
            background: none; border: none; cursor: pointer; color: var(--fa-text);
            width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
            border-radius: 50%; transition: background 0.2s;
        }
        .fa-btn svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            display: block;
        }
        .fa-btn-icon:hover { background: var(--fa-surface); }
        .fa-header-title {
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        margin: 0;
}
        /* --- VIEWS --- */
        .fa-view {
            flex: 1; display: none; flex-direction: column; align-items: center;
            padding: 0 24px 30px 24px;
            width: 100%; height: 100%;
            animation: faFadeIn 0.4s ease-out;
            overflow-y: auto;
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
            border-radius: 50px; /* Borda redonda premium */
            cursor: pointer; transition: transform 0.1s, background 0.2s, box-shadow 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 10px;
            margin-top: auto; /* Empurra para baixo */
            box-shadow: 0 4px 15px rgba(172, 134, 92, 0.3);
        }
        .fa-btn:hover { background: var(--fa-primary-dark); transform: translateY(-1px); }
        .fa-btn:active { transform: scale(0.98); }
        .fa-btn.secondary { background: #EFEFEF; color: var(--fa-text); box-shadow: none; margin-top: 10px; }
        .fa-btn.secondary:hover { background: #E0E0E0; }
        .fa-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* --- INTRO SCREEN --- */
        .fa-hero-img { width: 80%; max-width: 280px; margin: 20px 0; object-fit: contain; }
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
        /* O "Frame" oval */
        .fa-camera-frame {
            width: 100%; height: 100%;
            border-radius: 160px; /* Oval Vertical */
            overflow: hidden;
            position: relative;
            background: #000;
            border: 6px solid var(--fa-primary);
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transform: translateZ(0); /* Hardware accel */
        }
        #fa-video-element, #fa-canvas-element {
            width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); /* Espelhar */
        }
        #fa-canvas-element { display: none; }
        
        /* Scan Effect */
        .fa-scan-line {
            position: absolute; top: 0; left: 0; width: 100%; height: 4px;
            background: rgba(255,255,255,0.7);
            box-shadow: 0 0 20px 5px rgba(255,255,255,0.5);
            animation: scanMove 3s infinite ease-in-out;
            opacity: 0.6;
            display: none;
        }
        .fa-view.camera-active .fa-scan-line { display: block; }
        @keyframes scanMove { 0% { top: 5%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 95%; opacity: 0; } }

        .fa-instruction-badge {
    background: rgba(255,255,255,0.9);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--fa-primary);

    position: absolute;
    top: calc(60px + 16px); /* altura do header + respiro */
    z-index: 10;

    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
       }
        /* --- PROCESSING & LOADING --- */
        .fa-loader-container {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 100%; width: 100%;
        }
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
        .fa-compare-container {
            display: flex; gap: 10px; margin: 20px 0; width: 100%; justify-content: center;
        }
        .fa-compare-box {
            width: 45%; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; position: relative;
        }
        .fa-compare-img { width: 100%; height: 100%; object-fit: cover; }
        .fa-compare-label {
            position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6);
            color: #fff; font-size: 11px; text-align: center; padding: 4px;
        }
        .fa-blur {
        filter:
        blur(2.5px)
        brightness(0.75)
        contrast(0.9)
        saturate(0.6);
       }
        /* --- LOCKED SCREEN --- */
        .fa-lock-timer {
            font-size: 32px; font-weight: 700; color: var(--fa-primary); margin: 20px 0;
            font-variant-numeric: tabular-nums;
        }

        /* Responsive */
        @media (max-height: 700px) {
            .fa-camera-wrapper { max-width: 240px; }
            .fa-hero-img { width: 160px; }
        }
    `;
    document.head.appendChild(style);

    // 4. ESTRUTURA HTML (Single Page Application)
    const htmlStructure = `
    <div id="frame-auth-overlay">
        <div class="fa-container">
            <div class="fa-header" id="fa-header">
                <button class="fa-btn-icon" id="fa-back-btn">${ICONS.back}</button>
                <div class="fa-header-title">Reconhecimento Facial</div>
                <div style="width:40px"></div> </div>

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

            <div class="fa-view" id="view-permission">
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <div style="width:80px; height:80px; background:var(--fa-surface); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--fa-primary); margin-bottom:24px;">
                        ${ICONS.camera}
                    </div>
                    <div class="fa-title">Precisamos da<br>sua câmera</div>
                    <div class="fa-text">Para confirmar sua identidade, precisamos de acesso temporário à câmera do seu dispositivo.</div>
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
                        <img id="fa-review-image" style="width:100%; height:100%; object-fit:cover; transform: scaleX(-1);">
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
                <div class="fa-title">Algo deu errado com sua foto</div>
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

                <div class="fa-text">Vamos tentar novamente? Siga nossas dicas sobre iluminação, ângulos e qualidade.</div>
                <button class="fa-btn" id="btn-retry-flow">Tentar novamente</button>
                <div style="margin-top:15px; font-size:12px; color:#999;" id="attempts-display"></div>
            </div>

<div class="fa-view" id="view-locked">

    <!-- IMAGEM DE BLOQUEIO -->
    <img 
        src="https://framerusercontent.com/images/xNUS3aT2l7cjcIaseDNww9QbTKE.png"
        alt="Acesso bloqueado"
        class="fa-locked-image"
    >

    <div style="color:var(--fa-error); margin:20px 0;">
        ${ICONS.lock}
    </div>

    <div class="fa-title">Seu acesso foi bloqueado</div>

    <div class="fa-text">
        Limite de tentativas atingido por falhas consecutivas na verificação facial.
        Por segurança, aguarde o prazo indicado abaixo antes de tentar novamente.
    </div>

    <div class="fa-lock-timer" id="lock-timer">23:59:59</div>

    <button class="fa-btn secondary" id="btn-close-app">Fechar</button>
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
            locked: document.getElementById('view-locked')
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
        processingIcon: document.getElementById('processing-icon'),
        processingTitle: document.getElementById('processing-title'),
        attemptsDisplay: document.getElementById('attempts-display')
    };

    let state = {
        stream: null,
        attempts: 0,
        cameraReady: false,
        capturedImage: null
    };

    // Controle de Bloqueio
    function checkBlockStatus() {
        const blockEnd = localStorage.getItem('fa_block_end');
        if (blockEnd && Date.now() < parseInt(blockEnd)) {
            startLockTimer(parseInt(blockEnd));
            switchView('locked');
            return true;
        }
        return false;
    }

    function switchView(viewName) {
        // Esconde todas
        Object.values(elements.views).forEach(el => {
            el.classList.remove('active');
            el.classList.remove('camera-active'); // Remove animação de scan se houver
        });
        
        // Header visibility
        if (viewName === 'processing' || viewName === 'locked') {
            elements.header.style.visibility = 'hidden';
        } else {
            elements.header.style.visibility = 'visible';
        }

        // Mostra alvo
        elements.views[viewName].classList.add('active');

        // Logica especifica da view
        if (viewName === 'camera') {
            elements.views[viewName].classList.add('camera-active');
        }
    }

    // --- CÂMERA ---
    async function startCamera() {
        try {
            const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
            state.stream = await navigator.mediaDevices.getUserMedia(constraints);
            elements.video.srcObject = state.stream;
            
            // UX: Esperar o vídeo carregar para mostrar
            elements.video.onloadedmetadata = () => {
                switchView('camera');
                elements.buttons.capture.textContent = "Começar";
                state.cameraReady = false; // Usuário precisa clicar em começar
                document.getElementById('camera-instructions').textContent = "Posicione seu rosto, mantenha o celular na altura dos olhos e toque para iniciar a verificação.";
                document.getElementById('camera-badge').textContent = "Prepare-se";
                document.querySelector('.fa-scan-line').style.display = 'none';
            };
        } catch (err) {
            console.error("Erro camera", err);
            alert("Não foi possível acessar a câmera. Para que possamos iniciar sua verificação, verifique as permissões.");
            switchView('permission');
        }
    }

    function stopCamera() {
        if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop());
            state.stream = null;
        }
    }

    function takePicture() {
        const context = elements.canvas.getContext('2d');
        elements.canvas.width = elements.video.videoWidth;
        elements.canvas.height = elements.video.videoHeight;
        context.drawImage(elements.video, 0, 0);
        
        const dataUrl = elements.canvas.toDataURL('image/jpeg', 0.85);
        state.capturedImage = dataUrl;
        
        // Set images for next screens
        elements.reviewImg.src = dataUrl;
        elements.errorUserImg.src = dataUrl;
        
        stopCamera();
        switchView('review');
    }

    // --- SEQUÊNCIA DE VALIDAÇÃO (MOCK) ---
    function processVerification() {
        switchView('processing');
        
        // Etapa 1: Uploading
        elements.processingIcon.innerHTML = ICONS.user;
        elements.processingTitle.textContent = "Validando seu rosto...";
        
        setTimeout(() => {
            // Etapa 2: Segurança
            elements.processingIcon.innerHTML = ICONS.lock;
            elements.processingIcon.style.animation = 'none';
            elements.processingIcon.offsetHeight; /* trigger reflow */
            elements.processingIcon.style.animation = 'popIn 0.5s ease';
            elements.processingTitle.textContent = "Dados protegidos com segurança Frame...";
            
            setTimeout(() => {
                // Etapa 3: FALHA (Regras)
                handleFail();
            }, 2000);
        }, 2000);
    }

    function handleFail() {
        state.attempts++;
        const remaining = CONFIG.maxAttempts - state.attempts;
        
        if (remaining <= 0) {
            // Bloqueio
            const unlockTime = Date.now() + CONFIG.blockTimeMs;
            localStorage.setItem('fa_block_end', unlockTime);
            startLockTimer(unlockTime);
            switchView('locked');
        } else {
            // Erro comum
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
                localStorage.removeItem('fa_block_end');
                location.reload();
                return;
            }
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('lock-timer').textContent = 
                `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            requestAnimationFrame(update);
        };
        update();
    }

    // 7. EVENT LISTENERS
    
    // Intro -> Permission
    elements.buttons.introNext.onclick = () => {
        // Verifica se já tem permissão (mock check)
        navigator.permissions.query({name: 'camera'}).then(res => {
            if (res.state === 'granted') startCamera();
            else switchView('permission');
        }).catch(() => switchView('permission'));
    };

    // Permission -> Camera
    elements.buttons.allowCamera.onclick = () => {
        startCamera();
    };

    // Camera State Logic (Botão Começar vs Capturar)
    elements.buttons.capture.onclick = () => {
        if (!state.cameraReady) {
            // Estado 1: Usuário clica em "Começar"
            state.cameraReady = true;
            elements.buttons.capture.textContent = "Tirar foto";
            document.getElementById('camera-instructions').textContent = "Mantenha seu rosto dentro da moldura e clique em 'Tirar foto' quando estiver pronto.";
            document.getElementById('camera-badge').textContent = "Capturando...";
            document.querySelector('.fa-scan-line').style.display = 'block'; // Ativa scan
        } else {
            // Estado 2: Usuário tira a foto
            takePicture();
        }
    };

    // Review -> Process
    elements.buttons.confirm.onclick = processVerification;

    // Review -> Retry
    elements.buttons.retake.onclick = () => {
        startCamera();
    };

    // Error -> Retry
    elements.buttons.retry.onclick = () => {
        startCamera();
    };

    // Botão Voltar (Header)
    elements.buttons.back.onclick = () => {
        // Redirecionamento mockado conforme pedido
        if(confirm("Deseja sair da verificação?")) {
            window.location.href = "https://www.frameag.com/cadastro"; // Sub
        }
    };

    // Fechar app (Bloqueado)
    document.getElementById('btn-close-app').onclick = () => {
        window.location.href = "https://www.frameag.com/cadastro";
    };

    // 8. INICIALIZAÇÃO
    if (!checkBlockStatus()) {
        switchView('intro');
    }

})();