// ===== Injetar Meta Viewport para Responsividade em Mobile =====
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(metaViewport);

// ===== Injetar Link de Fontes (Montserrat, como no original) =====
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
fontLink.rel = 'preload';
fontLink.as = 'style';
fontLink.onload = function() { this.rel = 'stylesheet'; };
document.head.appendChild(fontLink);

// ===== Injetar CSS (mantendo paleta original, adicionando dark mode e animações) =====
const style = document.createElement('style');
style.textContent = `
:root {
  --bg-color: #fff;
  --text-color: #333;
  --accent-color: #AC865C;
  --accent-light: #8b6d4d;
  --secondary-bg: #f8f8f8;
  --border-color: rgba(0,0,0,0.1);
  --shadow-color: rgba(0,0,0,0.2);
  --error-color: #E05050;
}

body.dark {
  --bg-color: #1a1a1a;
  --text-color: #fff;
  --secondary-bg: #141414;
  --border-color: rgba(255,255,255,0.1);
  --shadow-color: rgba(0,0,0,0.5);
  --error-color: #FF6961;
}

#popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeIn 0.5s ease forwards;
}

#popup-box {
  background: var(--bg-color);
  max-width: 500px;
  width: 95%;
  padding: 24px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px var(--shadow-color);
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  z-index: 9999;
  color: var(--text-color);
}

#popup-box h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 14px;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#camera-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto 16px;
  display: flex;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
}

#cameraPreview {
  width: 100%;
  height: auto;
  aspect-ratio: 3/4;
  border-radius: 12px;
  border: 3px solid rgba(172, 134, 92, 0.4);
  background: #000;
  object-fit: cover;
  display: block;
  transform: scaleX(-1);
  transition: border-color 0.3s ease;
}

#cameraPreview.active {
  border-color: var(--accent-color);
}

.verificacao-status {
  margin-top: 16px;
  transition: opacity 0.3s ease;
}

.verificacao-status-top {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text-color);
}

.verificacao-status-bottom {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

#loadingCircle {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(172, 134, 92, 0.3);
  border-top: 4px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}

#falha-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.4s ease;
}

#falha-overlay.show {
  display: flex;
  opacity: 1;
}

#falha-overlay h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

#falha-overlay p {
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 16px 0;
  text-align: center;
}

#falha-reason {
  font-size: 13px;
  margin-bottom: 12px;
  color: var(--error-color);
}

#botaoEntendi, #botaoRetry {
  background: var(--accent-color);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  margin: 5px;
}

#botaoEntendi:hover, #botaoRetry:hover {
  background: var(--accent-light);
  transform: scale(1.02);
}

#botaoRetry:disabled {
  background: #ccc;
  cursor: not-allowed;
}

#progressBar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  width: 100%;
  margin: 10px 0;
}

.progress {
  height: 100%;
  background: var(--accent-color);
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 2px;
}

#attemptsCountdown {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

#instructions {
  font-size: 13px;
  color: #888;
  margin-bottom: 12px;
  text-align: left;
  padding: 0 10px;
}

.icon-svg {
  width: 24px;
  height: 24px;
  fill: var(--accent-color);
  margin-bottom: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@media (max-width: 600px) {
  #popup-box {
    padding: 16px 12px;
    width: 90%;
  }
  #camera-container {
    max-width: 280px;
  }
  #popup-box h2 {
    font-size: 18px;
  }
}
`;
document.head.appendChild(style);

// ===== Injetar HTML Estrutura =====
document.body.innerHTML += `
<div id="popup-overlay" style="display: none;">
  <div id="popup-box">
    <h2>Frame Authentic</h2>
    <p id="instructions">Instruções: Posicione seu rosto no centro da câmera, em um local bem iluminado. Mantenha o rosto neutro.</p>
    <div id="progressBar"><div class="progress"></div></div>
    <div id="camera-container">
      <video id="cameraPreview" autoplay playsinline muted></video>
      <div id="loadingCircle"></div>
      <div id="falha-overlay">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/></svg>
        <h3>Houve uma falha na verificação.</h3>
        <p id="falha-reason"></p>
        <p>Verifique a qualidade da sua câmera e tente novamente mais tarde.</p>
        <button id="botaoRetry">Tentar novamente</button>
        <button id="botaoEntendi">Certo, retornar ao login</button>
      </div>
    </div>
    <div class="verificacao-status" aria-live="polite">
      <div class="verificacao-status-top">Processo de verificação</div>
      <div class="verificacao-status-bottom">Aguardando permissão para ativar sua câmera</div>
    </div>
    <div id="attemptsCountdown"></div>
  </div>
</div>
`;

// ===== Lógica JavaScript (Modularizada) =====
const strings = {
  instructions: 'Instruções: Posicione seu rosto no centro da câmera, em um local bem iluminado. Mantenha o rosto neutro.',
  statusWaiting: 'Aguardando permissão para ativar sua câmera',
  statusActive: 'Sua câmera está ativa. Aguarde as instruções.',
  statusProcessing: 'Verificação em andamento',
  statusFailed: 'Falha na verificação',
  statusBottomFailed: 'Tente novamente mais tarde',
  permissionDenied: 'Permissão negada',
  permissionDeniedBottom: 'Reinicie a página para tentar novamente',
  attemptsRemaining: 'Tentativas restantes: ',
  blocked: 'Verificação bloqueada por 5 minutos devido a múltiplas falhas.',
  errorReasons: [
    'Iluminação insuficiente detectada.',
    'Rosto não detectado claramente.',
    'Conexão com o servidor instável.',
    'Qualidade da imagem abaixo do esperado.',
    'Movimento excessivo durante a captura.'
  ]
};

const popupOverlay = document.getElementById('popup-overlay');
const statusTop = document.querySelector('.verificacao-status-top');
const statusBottom = document.querySelector('.verificacao-status-bottom');
const loading = document.getElementById('loadingCircle');
const falhaOverlay = document.getElementById('falha-overlay');
const falhaReason = document.getElementById('falha-reason');
const cameraPreview = document.getElementById('cameraPreview');
const progress = document.querySelector('.progress');
const attemptsCountdown = document.getElementById('attemptsCountdown');
const botaoRetry = document.getElementById('botaoRetry');
const botaoEntendi = document.getElementById('botaoEntendi');
const instructions = document.getElementById('instructions');

let stream = null;
let attempts = 0;
const maxAttempts = 3;
const blockTime = 5 * 60 * 1000; // 5 minutos em ms
let blockEndTime = parseInt(localStorage.verificationBlockEnd) || 0;

function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function logAction(action) {
  let log = JSON.parse(localStorage.log || '[]');
  log.push({ action: sanitizeInput(action), date: new Date().toLocaleString('pt-BR') });
  localStorage.log = JSON.stringify(log);
}

function isBlocked() {
  const now = Date.now();
  if (now < blockEndTime) {
    return true;
  }
  return false;
}

function startCountdown() {
  const remaining = Math.ceil((blockEndTime - Date.now()) / 1000);
  attemptsCountdown.textContent = `${strings.blocked} Tempo restante: ${remaining}s`;
  const interval = setInterval(() => {
    const rem = Math.ceil((blockEndTime - Date.now()) / 1000);
    if (rem <= 0) {
      clearInterval(interval);
      attemptsCountdown.textContent = '';
      attempts = 0;
      initVerification();
    } else {
      attemptsCountdown.textContent = `${strings.blocked} Tempo restante: ${rem}s`;
    }
  }, 1000);
}

function initCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusTop.textContent = 'Câmera não suportada';
    statusBottom.textContent = 'Seu navegador ou dispositivo não suporta acesso à câmera.';
    logAction('Falha: Câmera não suportada');
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(function(s) {
      stream = s;
      cameraPreview.srcObject = stream;
      cameraPreview.classList.add('active');
      statusTop.textContent = strings.statusProcessing;
      statusBottom.textContent = strings.statusActive;
      loading.style.display = 'block';
      progress.style.width = '50%';
      logAction('Câmera acessada com sucesso (início de verificação)');

      // Simula processamento com progresso
      setTimeout(() => { progress.style.width = '80%'; }, 1500);

      // Sempre falha após tempo randômico (4-6s)
      const failDelay = Math.random() * 2000 + 4000;
      setTimeout(handleFailure, failDelay);
    })
    .catch(function(error) {
      statusTop.textContent = strings.permissionDenied;
      statusBottom.textContent = strings.permissionDeniedBottom;
      logAction(`Falha: ${error.name} - ${error.message}`);
    });
}

function handleFailure() {
  attempts++;
  loading.style.display = 'none';
  progress.style.width = '0%';
  falhaOverlay.classList.add('show');
  const randomReason = strings.errorReasons[Math.floor(Math.random() * strings.errorReasons.length)];
  falhaReason.textContent = randomReason;
  statusTop.textContent = strings.statusFailed;
  statusBottom.textContent = strings.statusBottomFailed;
  attemptsCountdown.textContent = `${strings.attemptsRemaining}${maxAttempts - attempts}`;
  logAction(`Falha na verificação: ${randomReason} (Tentativa ${attempts})`);

  if (attempts >= maxAttempts) {
    botaoRetry.disabled = true;
    blockEndTime = Date.now() + blockTime;
    localStorage.verificationBlockEnd = blockEndTime;
    startCountdown();
    logAction('Verificação bloqueada por excesso de tentativas');
  }

  stopCamera();
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  cameraPreview.srcObject = null;
  cameraPreview.classList.remove('active');
}

function retryVerification() {
  falhaOverlay.classList.remove('show');
  initCamera();
}

function initVerification() {
  if (isBlocked()) {
    startCountdown();
    return;
  }
  instructions.textContent = strings.instructions;
  popupOverlay.style.display = 'flex';
  initCamera();
}

// Eventos
botaoRetry.addEventListener('click', retryVerification);
botaoEntendi.addEventListener('click', () => {
  if (confirm('Deseja retornar ao login?')) {
    stopCamera();
    window.location.href = '/home';
  }
});

// Detectar tema
if (localStorage.theme === 'dark' || document.body.classList.contains('dark')) {
  document.body.classList.add('dark');
}

// Iniciar ao carregar
document.addEventListener('DOMContentLoaded', initVerification);

// Limpar ao unload
window.addEventListener('beforeunload', stopCamera);